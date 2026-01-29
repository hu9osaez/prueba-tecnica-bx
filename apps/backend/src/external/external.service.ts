import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RickAndMortyClient, PokemonClient, SuperheroClient } from './clients';
import type { InternalCharacter } from './interfaces';
import { ExternalApiException } from '../common/exceptions';

const SOURCES: Array<'rick-morty' | 'pokemon' | 'superhero'> = [
  'rick-morty',
  'pokemon',
  'superhero',
];

interface CacheEntry {
  character: InternalCharacter;
  expiresAt: number;
}

@Injectable()
export class ExternalService {
  private readonly logger = new Logger(ExternalService.name);
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheTtl: number;

  constructor(
    private readonly rickAndMortyClient: RickAndMortyClient,
    private readonly pokemonClient: PokemonClient,
    private readonly superheroClient: SuperheroClient,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtl =
      this.configService.get<number>('API_CACHE_TTL_SECONDS', 3600) * 1000;
  }

  async getRandomCharacter(
    source?: 'rick-morty' | 'pokemon' | 'superhero',
  ): Promise<InternalCharacter> {
    if (source) {
      return this.getFromSource(source);
    }

    // Random source selection with fallback
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      const selectedSource = this.selectRandomSource();
      this.logger.log(
        `Selected random source: ${selectedSource} (attempt ${attempts + 1}/${maxAttempts})`,
      );

      try {
        return await this.getFromSource(selectedSource);
      } catch (error) {
        attempts++;
        this.logger.warn(
          `Failed to get character from ${selectedSource}, trying next source`,
          {
            error: error.message,
          },
        );

        if (attempts >= maxAttempts) {
          throw new ExternalApiException(
            'multiple',
            `Failed to fetch character from all ${maxAttempts} attempted sources`,
          );
        }
      }
    }

    throw new ExternalApiException(
      'unknown',
      'Unable to fetch character from any source',
    );
  }

  async getCharacterById(
    source: 'rick-morty' | 'pokemon' | 'superhero',
    id: string,
  ): Promise<InternalCharacter> {
    this.logger.log(`Fetching character ${id} from ${source}`);

    const cacheKey = `${source}:${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    const character = await this.getFromSourceById(source, id);
    this.setCache(cacheKey, character);
    return character;
  }

  async getCharacterByName(
    name: string,
    source: 'rick-morty' | 'pokemon' | 'superhero',
  ): Promise<InternalCharacter> {
    this.logger.log(`Fetching character "${name}" from ${source}`);

    const cacheKey = `${source}:name:${name.toLowerCase()}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}`);
      return cached;
    }

    const character = await this.getFromSourceByName(source, name);
    this.setCache(cacheKey, character);
    return character;
  }

  private getFromSource(
    source: 'rick-morty' | 'pokemon' | 'superhero',
  ): Promise<InternalCharacter> {
    switch (source) {
      case 'rick-morty':
        return this.rickAndMortyClient.getRandomCharacter();
      case 'pokemon':
        return this.pokemonClient.getRandomCharacter();
      case 'superhero':
        return this.superheroClient.getRandomCharacter();
    }
  }

  private getFromSourceById(
    source: 'rick-morty' | 'pokemon' | 'superhero',
    id: string,
  ): Promise<InternalCharacter> {
    switch (source) {
      case 'rick-morty':
        return this.rickAndMortyClient.getCharacterById(id);
      case 'pokemon':
        return this.pokemonClient.getCharacterById(id);
      case 'superhero':
        return this.superheroClient.getCharacterById(id);
    }
  }

  private getFromSourceByName(
    source: 'rick-morty' | 'pokemon' | 'superhero',
    name: string,
  ): Promise<InternalCharacter> {
    switch (source) {
      case 'rick-morty':
        throw new Error(
          'getCharacterByName not supported for rick-morty source yet',
        );
      case 'pokemon':
        return this.pokemonClient.getCharacterByName(name);
      case 'superhero':
        throw new Error(
          'getCharacterByName not supported for superhero source yet',
        );
    }
  }

  private selectRandomSource(): 'rick-morty' | 'pokemon' | 'superhero' {
    const randomIndex = Math.floor(Math.random() * SOURCES.length);
    return SOURCES[randomIndex];
  }

  private getFromCache(key: string): InternalCharacter | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.character;
  }

  private setCache(key: string, character: InternalCharacter): void {
    this.cache.set(key, {
      character,
      expiresAt: Date.now() + this.cacheTtl,
    });
  }

  clearCache(): void {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }
}
