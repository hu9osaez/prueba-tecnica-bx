import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { StarWarsPersonResponse, StarWarsListResponse } from '../dto';
import type { InternalCharacter } from '../interfaces';
import {
  StarWarsApiException,
  CharacterNotFoundException,
} from '../../common/exceptions';

const STAR_WARS_IMAGE_BASE_URL =
  'https://starwars-visualguide.com/assets/img/characters';

@Injectable()
export class StarWarsClient {
  private readonly logger = new Logger(StarWarsClient.name);
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly totalCharacters: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('STAR_WARS_API_URL') ??
      'https://swapi.dev/api';
    this.timeout = this.configService.get<number>('API_TIMEOUT_MS', 5000);
    // SWAPI has approximately 82 characters
    this.totalCharacters = 82;
  }

  async getRandomCharacter(): Promise<InternalCharacter> {
    try {
      const randomId = Math.floor(Math.random() * this.totalCharacters) + 1;
      return this.getCharacterById(randomId.toString());
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getCharacterById(id: string): Promise<InternalCharacter> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<StarWarsPersonResponse>(
          `${this.baseUrl}/people/${id}`,
          {
            timeout: this.timeout,
          },
        ),
      );

      return this.toInternalCharacter(data, id);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new CharacterNotFoundException('star-wars', id);
      }
      this.handleApiError(error);
    }
  }

  async getCharacterByName(name: string): Promise<InternalCharacter> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<StarWarsListResponse>(
          `${this.baseUrl}/people/?search=${encodeURIComponent(name)}`,
          {
            timeout: this.timeout,
          },
        ),
      );

      if (!data.results || data.results.length === 0) {
        throw new CharacterNotFoundException('star-wars', name);
      }

      // Extract ID from the URL of the first result
      const firstResult = data.results[0];
      const id = this.extractIdFromUrl(firstResult.url);

      return this.toInternalCharacter(firstResult, id);
    } catch (error) {
      if (error instanceof CharacterNotFoundException) {
        throw error;
      }
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new CharacterNotFoundException('star-wars', name);
      }
      this.handleApiError(error);
    }
  }

  private toInternalCharacter(
    data: StarWarsPersonResponse,
    id: string,
  ): InternalCharacter {
    const imageUrl = `${STAR_WARS_IMAGE_BASE_URL}/${id}.jpg`;

    return {
      externalId: id,
      name: data.name,
      source: 'star-wars',
      imageUrl,
    };
  }

  private extractIdFromUrl(url: string): string {
    // SWAPI URLs are in the format: https://swapi.dev/api/people/1/
    // Extract the ID from the URL
    const matches = url.match(/people\/(\d+)\//);
    return matches ? matches[1] : '1';
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
