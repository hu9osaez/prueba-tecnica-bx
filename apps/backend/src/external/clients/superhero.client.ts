import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { SuperheroResponse } from '../dto';
import { InternalCharacter } from '../interfaces';
import {
  SuperheroApiException,
  CharacterNotFoundException,
} from '../../common/exceptions';

const SUPERHERO_COUNT = 731;
const TOKEN_REDACTED = '[REDACTED]';

@Injectable()
export class SuperheroClient {
  private readonly logger = new Logger(SuperheroClient.name);
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('SUPERHERO_API_URL', '');
    this.token = this.configService.get<string>('SUPERHERO_API_TOKEN', '');
    this.timeout = this.configService.get<number>('API_TIMEOUT_MS', 5000);

    if (!this.token) {
      this.logger.warn(
        'SUPERHERO_API_TOKEN not configured - Superhero API will not work',
      );
    }
  }

  async getRandomCharacter(): Promise<InternalCharacter> {
    if (!this.token) {
      throw new SuperheroApiException('SUPERHERO_API_TOKEN not configured');
    }

    try {
      const randomId = Math.floor(Math.random() * SUPERHERO_COUNT) + 1;
      return this.getCharacterById(randomId.toString());
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async getCharacterById(id: string): Promise<InternalCharacter> {
    if (!this.token) {
      throw new SuperheroApiException('SUPERHERO_API_TOKEN not configured');
    }

    try {
      this.logger.log(`Fetching superhero ${id} from Superhero API`);

      const { data } = await firstValueFrom(
        this.httpService.get<SuperheroResponse>(this.buildUrl(id), {
          timeout: this.timeout,
          maxRedirects: 5,
        }),
      );

      return this.toInternalCharacter(data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new CharacterNotFoundException('superhero', id);
      }
      this.handleApiError(error);
    }
  }

  private buildUrl(id: string): string {
    return `${this.baseUrl}/${this.token}/${id}`;
  }

  private toInternalCharacter(data: SuperheroResponse): InternalCharacter {
    return {
      externalId: data.id,
      name: data.name,
      source: 'superhero',
      imageUrl: data.image.url,
    };
  }

  private handleApiError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error('Superhero API timeout');
        throw new SuperheroApiException('Request timeout');
      }
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data as {
          error?: string;
          message?: string;
        };
        const message = data.message || data.error || 'Unknown error';
        this.logger.error(
          `Superhero API error: ${status} - ${message} (URL: ${this.baseUrl}/${TOKEN_REDACTED})`,
        );
        if (status === 401) {
          throw new SuperheroApiException('Invalid API token');
        }
        throw new SuperheroApiException(message, status);
      }
    }
    this.logger.error('Unknown error calling Superhero API');
    throw new SuperheroApiException('Unexpected error occurred');
  }
}
