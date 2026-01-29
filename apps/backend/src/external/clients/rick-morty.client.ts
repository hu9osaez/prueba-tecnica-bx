import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { RickAndMortyApiResponse, RickAndMortyCharacterResponse } from '../dto';
import type { InternalCharacter } from '../interfaces';
import {
  RickAndMortyApiException,
  CharacterNotFoundException,
} from '../../common/exceptions';

@Injectable()
export class RickAndMortyClient {
  private readonly logger = new Logger(RickAndMortyClient.name);
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('RICK_AND_MORTY_API_URL') ??
      'https://rickandmortyapi.com/api';
    this.timeout = this.configService.get<number>('API_TIMEOUT_MS', 5000);
  }

  async getRandomCharacter(): Promise<InternalCharacter> {
    try {
      this.logger.log('Fetching random character from Rick and Morty API');

      // First get the character count
      const { data } = await firstValueFrom(
        this.httpService.get<RickAndMortyApiResponse>(
          `${this.baseUrl}/character`,
          {
            timeout: this.timeout,
          },
        ),
      );

      const count = data.info.count;
      const randomId = Math.floor(Math.random() * count) + 1;

      return this.getCharacterById(randomId.toString());
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getCharacterById(id: string): Promise<InternalCharacter> {
    try {
      this.logger.log(`Fetching character ${id} from Rick and Morty API`);

      const { data } = await firstValueFrom(
        this.httpService.get<RickAndMortyCharacterResponse>(
          `${this.baseUrl}/character/${id}`,
          {
            timeout: this.timeout,
          },
        ),
      );

      return this.toInternalCharacter(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new CharacterNotFoundException('rick-morty', id);
      }
      this.handleApiError(error);
    }
  }

  private toInternalCharacter(
    data: RickAndMortyCharacterResponse,
  ): InternalCharacter {
    return {
      externalId: data.id.toString(),
      name: data.name,
      source: 'rick-morty',
      imageUrl: data.image,
    };
  }

  private handleApiError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error('Rick and Morty API timeout');
        throw new RickAndMortyApiException('Request timeout');
      }
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || 'Unknown error';
        this.logger.error(`Rick and Morty API error: ${status} - ${message}`);
        throw new RickAndMortyApiException(message, status);
      }
    }
    this.logger.error('Unknown error calling Rick and Morty API', { error });
    throw new RickAndMortyApiException('Unexpected error occurred');
  }
}
