import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import type { InternalCharacter } from '../interfaces';
import {
  StarWarsApiException,
  CharacterNotFoundException,
} from '../../common/exceptions';

interface StarWarsCharacter {
  id: number;
  name: string;
  image: string;
}

@Injectable()
export class StarWarsClient implements OnModuleInit {
  private readonly logger = new Logger(StarWarsClient.name);
  private readonly baseUrl: string;
  private readonly timeout: number;
  private charactersCache: StarWarsCharacter[] = [];
  private totalCharacters = 0;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('STAR_WARS_API_URL') ??
      'https://akabab.github.io/starwars-api/api';
    this.timeout = this.configService.get<number>('API_TIMEOUT_MS', 10000);
  }

  async onModuleInit() {
    await this.loadAllCharacters();
  }

  private async loadAllCharacters() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<StarWarsCharacter[]>(`${this.baseUrl}/all.json`, {
          timeout: this.timeout,
        }),
      );

      this.charactersCache = data;
      this.totalCharacters = data.length;
      this.logger.log(`Loaded ${this.totalCharacters} Star Wars characters`);
    } catch (error) {
      this.logger.error('Failed to load Star Wars characters', { error });
    }
  }

  async getRandomCharacter(): Promise<InternalCharacter> {
    if (this.charactersCache.length === 0) {
      await this.loadAllCharacters();
    }

    if (this.charactersCache.length === 0) {
      throw new StarWarsApiException('No characters available');
    }

    const randomIndex = Math.floor(Math.random() * this.totalCharacters);
    const character = this.charactersCache[randomIndex];

    return this.toInternalCharacter(character);
  }

  async getCharacterById(id: string): Promise<InternalCharacter> {
    if (this.charactersCache.length === 0) {
      await this.loadAllCharacters();
    }

    const character = this.charactersCache.find(
      (c) => c.id === parseInt(id, 10),
    );

    if (!character) {
      throw new CharacterNotFoundException('star-wars', id);
    }

    return this.toInternalCharacter(character);
  }

  async getCharacterByName(name: string): Promise<InternalCharacter> {
    if (this.charactersCache.length === 0) {
      await this.loadAllCharacters();
    }

    const character = this.charactersCache.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );

    if (!character) {
      throw new CharacterNotFoundException('star-wars', name);
    }

    return this.toInternalCharacter(character);
  }

  private toInternalCharacter(data: StarWarsCharacter): InternalCharacter {
    return {
      externalId: data.id.toString(),
      name: data.name,
      source: 'star-wars',
      imageUrl: data.image,
    };
  }

  private handleApiError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error('Star Wars API timeout');
        throw new StarWarsApiException('Request timeout');
      }
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.detail || 'Unknown error';
        this.logger.error(`Star Wars API error: ${status} - ${message}`);
        throw new StarWarsApiException(message, status);
      }
    }
    this.logger.error('Unknown error calling Star Wars API', { error });
    throw new StarWarsApiException('Unexpected error occurred');
  }
}
