import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Vote, VoteDocument } from './schemas';
import { CharactersService } from '../characters/characters.service';

@Injectable()
export class VotesService {
  private readonly logger = new Logger(VotesService.name);

  constructor(
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
    private charactersService: CharactersService,
  ) {}

  async create(
    characterId: string,
    voteType: 'like' | 'dislike',
  ): Promise<VoteDocument> {
    const character = await this.charactersService.findById(characterId);
    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const vote = new this.voteModel({
      characterId: new Types.ObjectId(characterId),
      characterName: character.name,
      source: character.source,
      voteType,
      votedAt: new Date(),
    });

    const saved = await vote.save();
    this.logger.log(`Vote created: ${voteType} for ${character.name}`);
    return saved;
  }

  async createManual(
    characterName: string,
    source: string,
    voteType: 'like' | 'dislike',
  ): Promise<VoteDocument> {
    let character = await this.charactersService.findByExternalId(
      characterName.toLowerCase(),
      source,
    );

    if (!character) {
      character = await this.charactersService.createOrUpdate({
        externalId: characterName.toLowerCase(),
        name: characterName,
        source: source as any,
        imageUrl: '',
      });
    }

    const vote = new this.voteModel({
      characterId: character._id,
      characterName: character.name,
      source: character.source,
      voteType,
      votedAt: new Date(),
    });

    const saved = await vote.save();
    this.logger.log(`Manual vote created: ${voteType} for ${characterName}`);
    return saved;
  }

  async findByCharacter(characterId: string): Promise<VoteDocument[]> {
    return this.voteModel
      .find({ characterId: new Types.ObjectId(characterId) })
      .exec();
  }

  async getVoteCounts(characterId: string): Promise<{
    likes: number;
    dislikes: number;
  }> {
    const likes = await this.voteModel
      .countDocuments({
        characterId: new Types.ObjectId(characterId),
        voteType: 'like',
      })
      .exec();

    const dislikes = await this.voteModel
      .countDocuments({
        characterId: new Types.ObjectId(characterId),
        voteType: 'dislike',
      })
      .exec();

    return { likes, dislikes };
  }
}
