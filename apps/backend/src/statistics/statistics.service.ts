import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Vote, VoteDocument } from '../votes/schemas';
import { Character, CharacterDocument } from '../characters/schemas';
import { MostLikedResponseDto, PikachuStatsResponseDto } from './dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
  ) {}

  async getMostLiked(): Promise<MostLikedResponseDto | null> {
    const result = await this.voteModel
      .aggregate([
        { $match: { voteType: 'like' } },
        {
          $group: {
            _id: '$characterId',
            count: { $sum: 1 },
            characterName: { $first: '$characterName' },
            source: { $first: '$source' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ])
      .exec();

    if (result.length === 0) {
      return null;
    }

    const character = await this.characterModel.findById(result[0]._id).exec();
    if (!character) {
      return null;
    }

    return {
      character: {
        id: character._id.toString(),
        name: character.name,
        source: character.source,
        imageUrl: character.imageUrl,
      },
      likes: result[0].count,
    };
  }

  async getMostDisliked(): Promise<{
    character: {
      id: string;
      name: string;
      source: string;
      imageUrl: string;
    };
    dislikes: number;
  } | null> {
    const result = await this.voteModel
      .aggregate([
        { $match: { voteType: 'dislike' } },
        {
          $group: {
            _id: '$characterId',
            count: { $sum: 1 },
            characterName: { $first: '$characterName' },
            source: { $first: '$source' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ])
      .exec();

    if (result.length === 0) {
      return null;
    }

    const character = await this.characterModel.findById(result[0]._id).exec();
    if (!character) {
      return null;
    }

    return {
      character: {
        id: character._id.toString(),
        name: character.name,
        source: character.source,
        imageUrl: character.imageUrl,
      },
      dislikes: result[0].count,
    };
  }

  async getLastEvaluated(): Promise<{
    vote: {
      id: string;
      character: {
        name: string;
        source: string;
        imageUrl: string;
      };
      voteType: string;
      votedAt: string;
    };
  } | null> {
    const vote = await this.voteModel
      .findOne()
      .sort({ votedAt: -1 })
      .populate('characterId')
      .lean()
      .exec();

    if (!vote) {
      return null;
    }

    const character = await this.characterModel
      .findById(vote.characterId)
      .exec();

    return {
      vote: {
        id: vote._id.toString(),
        character: {
          name: vote.characterName,
          source: vote.source,
          imageUrl: character?.imageUrl || '',
        },
        voteType: vote.voteType,
        votedAt: vote.votedAt.toISOString(),
      },
    };
  }

  async getPikachuStats(): Promise<PikachuStatsResponseDto> {
    const votes = await this.voteModel
      .find({
        characterName: { $regex: /^pikachu$/, $options: 'i' },
      })
      .exec();

    if (votes.length === 0) {
      return {
        character: {
          name: 'Pikachu',
          source: 'pokemon',
          exists: false,
        },
      };
    }

    const likes = votes.filter((v) => v.voteType === 'like').length;
    const dislikes = votes.filter((v) => v.voteType === 'dislike').length;
    const sortedVotes = votes.sort(
      (a, b) => a.votedAt.getTime() - b.votedAt.getTime(),
    );

    return {
      character: {
        name: 'Pikachu',
        source: 'pokemon',
        exists: true,
      },
      statistics: {
        likes,
        dislikes,
        netScore: likes - dislikes,
        totalVotes: votes.length,
        firstVoteAt: sortedVotes[0].votedAt.toISOString(),
        lastVoteAt: sortedVotes[votes.length - 1].votedAt.toISOString(),
      },
    };
  }
}
