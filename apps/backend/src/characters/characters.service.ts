import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Character, CharacterDocument } from './schemas';

export interface ExternalCharacter {
  externalId: string;
  name: string;
  source: 'rick-morty' | 'pokemon' | 'superhero';
  imageUrl: string;
}

@Injectable()
export class CharactersService {
  private readonly logger = new Logger(CharactersService.name);

  constructor(
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
  ) {}

  async createOrUpdate(
    externalCharacter: ExternalCharacter,
  ): Promise<CharacterDocument> {
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
  }

  async findById(id: string): Promise<CharacterDocument | null> {
    return this.characterModel.findById(id).exec();
  }

  async findByExternalId(
    externalId: string,
    source: string,
  ): Promise<CharacterDocument | null> {
    return this.characterModel.findOne({ externalId, source }).exec();
  }

  async getRandomCharacter(
    source?: 'rick-morty' | 'pokemon' | 'superhero',
  ): Promise<CharacterDocument | null> {
    const query = source ? { source } : {};

    const count = await this.characterModel.countDocuments(query);

    if (count === 0) {
      return null;
    }

    const random = Math.floor(Math.random() * count);
    return this.characterModel.findOne(query).skip(random).exec();
  }

  async findAll(): Promise<CharacterDocument[]> {
    return this.characterModel.find().exec();
  }
}
