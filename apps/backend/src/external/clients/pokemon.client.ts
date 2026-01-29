import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { PokemonResponse } from '../dto';
import type { InternalCharacter } from '../interfaces';
import {
  PokemonApiException,
  CharacterNotFoundException,
} from '../../common/exceptions';

const FIRST_GEN_POKEMON_COUNT = 151;

@Injectable()
export class PokemonClient {
  private readonly logger = new Logger(PokemonClient.name);
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('POKEMON_API_URL') ??
      'https://pokeapi.co/api/v2';
    this.timeout = this.configService.get<number>('API_TIMEOUT_MS', 5000);
  }

  async getRandomCharacter(): Promise<InternalCharacter> {
    try {
      const randomId = Math.floor(Math.random() * FIRST_GEN_POKEMON_COUNT) + 1;
      return this.getCharacterById(randomId.toString());
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getCharacterById(id: string): Promise<InternalCharacter> {
    try {
      this.logger.log(`Fetching Pokemon ${id} from Pokemon API`);

      const { data } = await firstValueFrom(
        this.httpService.get<PokemonResponse>(`${this.baseUrl}/pokemon/${id}`, {
          timeout: this.timeout,
        }),
      );

      return this.toInternalCharacter(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new CharacterNotFoundException('pokemon', id);
      }
      this.handleApiError(error);
    }
  }

  private toInternalCharacter(data: PokemonResponse): InternalCharacter {
    const imageUrl =
      data.sprites.other['official-artwork'].front_default ||
      data.sprites.front_default ||
      '';

    return {
      externalId: data.id.toString(),
      name: this.capitalize(data.name),
      source: 'pokemon',
      imageUrl,
    };
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private handleApiError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error('Pokemon API timeout');
        throw new PokemonApiException('Request timeout');
      }
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || 'Unknown error';
        this.logger.error(`Pokemon API error: ${status} - ${message}`);
        throw new PokemonApiException(message, status);
      }
    }
    this.logger.error('Unknown error calling Pokemon API', { error });
    throw new PokemonApiException('Unexpected error occurred');
  }
}
