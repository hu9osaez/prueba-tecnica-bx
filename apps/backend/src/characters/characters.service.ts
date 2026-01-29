import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Character, CharacterDocument } from './schemas';
import { ExternalService } from '../external/external.service';
import { SessionsService } from '../sessions/sessions.service';

export interface ExternalCharacter {
  externalId: string;
  name: string;
  source: 'rick-morty' | 'pokemon' | 'superhero' | 'star-wars';
  imageUrl: string;
}

@Injectable()
export class CharactersService {
  private readonly logger = new Logger(CharactersService.name);
  private readonly MIN_CHARACTERS_FOR_CACHE = 10;
  private readonly EXTERNAL_API_PROBABILITY = 0.3;

  constructor(
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
    private readonly externalService: ExternalService,
    private readonly sessionsService: SessionsService,
  ) {}

  async createOrUpdate(
    externalCharacter: ExternalCharacter,
  ): Promise<CharacterDocument> {
    try {
      const character = await this.characterModel.findOneAndUpdate(
        {
          externalId: externalCharacter.externalId,
          source: externalCharacter.source,
        },
        externalCharacter,
        { upsert: true, new: true },
      );

      this.logger.log(`Character created/updated: ${character.name}`);
      return character;
    } catch (error) {
      this.logger.error('Error createOrUpdate:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<CharacterDocument | null> {
    try {
      return this.characterModel.findById(id).exec();
    } catch (error) {
      this.logger.error('Error findById:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findByExternalId(
    externalId: string,
    source: string,
  ): Promise<CharacterDocument | null> {
    try {
      return this.characterModel.findOne({ externalId, source }).exec();
    } catch (error) {
      this.logger.error('Error findByExternalId:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getRandomCharacter(
    source?: 'rick-morty' | 'pokemon' | 'superhero' | 'star-wars',
    excludeIds?: string[],
    sessionId?: string,
  ): Promise<CharacterDocument | null> {
    try {
      const query: Record<string, unknown> = source ? { source } : {};

      // Get voted IDs from session if sessionId provided
      let sessionIds: Types.ObjectId[] = [];
      if (sessionId) {
        sessionIds = await this.sessionsService.getVotedIds(sessionId);
      }

      // Combine both exclusion lists
      const allExcludeIds: string[] = [...(excludeIds || [])];
      if (sessionIds.length > 0) {
        allExcludeIds.push(...sessionIds.map((id) => id.toString()));
      }

      if (allExcludeIds.length > 0) {
        query._id = { $nin: allExcludeIds };
      }

      const count = await this.characterModel.countDocuments(query);

      // Hybrid strategy: ensure true randomness and variety
      const shouldFetchFromExternal =
        count === 0 ||
        count < this.MIN_CHARACTERS_FOR_CACHE ||
        Math.random() < this.EXTERNAL_API_PROBABILITY;

      if (shouldFetchFromExternal) {
        this.logger.log(
          `Fetching from external API (count: ${count}, source: ${source || 'any'}, excluded: ${allExcludeIds.length})`,
        );
        const externalCharacter =
          await this.externalService.getRandomCharacter(source);

        if (allExcludeIds.length > 0) {
          const existing = await this.characterModel.findOne({
            externalId: externalCharacter.externalId,
            source: externalCharacter.source,
            _id: { $nin: allExcludeIds },
          });
          if (existing) {
            return existing;
          }
        }

        return this.createOrUpdate(externalCharacter);
      }

      // Use MongoDB aggregate with $sample for true randomness
      const [character] = await this.characterModel
        .aggregate<CharacterDocument>([
          { $match: query },
          { $sample: { size: 1 } },
        ])
        .exec();

      if (!character) {
        // Fallback to external API if aggregate fails
        this.logger.warn(
          'Aggregate returned no results, fetching from external API',
        );
        const externalCharacter =
          await this.externalService.getRandomCharacter(source);
        return this.createOrUpdate(externalCharacter);
      }

      return character;
    } catch (error) {
      this.logger.error('Error getRandomCharacter:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findAll(): Promise<CharacterDocument[]> {
    try {
      return this.characterModel.find().exec();
    } catch (error) {
      this.logger.error('Error findAll:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findOrFetchByName(
    name: string,
    source: 'rick-morty' | 'pokemon' | 'superhero' | 'star-wars',
  ): Promise<CharacterDocument | null> {
    try {
      const existing = await this.characterModel
        .findOne({ name: { $regex: `^${name}$`, $options: 'i' } })
        .exec();

      if (existing) {
        this.logger.log(`Character found in DB: ${existing.name}`);
        return existing;
      }

      this.logger.log(
        `Character "${name}" not found in DB, fetching from ${source} API`,
      );

      try {
        const externalCharacter = await this.externalService.getCharacterByName(
          name,
          source,
        );
        return this.createOrUpdate(externalCharacter);
      } catch (apiError) {
        this.logger.warn(
          `Failed to fetch character "${name}" from ${source} API`,
          {
            error: apiError.message,
          },
        );
        return null;
      }
    } catch (error) {
      this.logger.error('Error findOrFetchByName:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
