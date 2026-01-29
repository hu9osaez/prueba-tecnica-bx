import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { VotingSession, VotingSessionDocument } from './schemas';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly SESSION_DURATION = 60 * 60 * 1000; // 1 hour

  constructor(
    @InjectModel(VotingSession.name)
    private votingSessionModel: Model<VotingSessionDocument>,
  ) {}

  async create(): Promise<VotingSessionDocument> {
    const sessionId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_DURATION);

    const session = new this.votingSessionModel({
      sessionId,
      votedCharacterIds: [],
      expiresAt,
      lastActivityAt: now,
    });

    this.logger.log(`Session created: ${sessionId}`);
    return await session.save();
  }

  async findBySessionId(
    sessionId: string,
  ): Promise<VotingSessionDocument | null> {
    try {
      return this.votingSessionModel.findOne({ sessionId }).exec();
    } catch {
      return null;
    }
  }

  async addVotedCharacter(
    sessionId: string,
    characterId: string,
  ): Promise<void> {
    const session = await this.findBySessionId(sessionId);
    if (!session) {
      this.logger.warn(`Session not found: ${sessionId}`);
      return;
    }

    const characterObjectId = new Types.ObjectId(characterId);
    if (!session.votedCharacterIds.some((id) => id.equals(characterObjectId))) {
      session.votedCharacterIds.push(characterObjectId);
      session.lastActivityAt = new Date();
      await session.save();
      this.logger.log(`Added character ${characterId} to session ${sessionId}`);
    }
  }

  async getVotedIds(sessionId: string): Promise<Types.ObjectId[]> {
    const session = await this.findBySessionId(sessionId);
    return session?.votedCharacterIds || [];
  }

  async delete(sessionId: string): Promise<void> {
    await this.votingSessionModel.deleteOne({ sessionId }).exec();
    this.logger.log(`Session deleted: ${sessionId}`);
  }

  async cleanupExpired(): Promise<void> {
    const result = await this.votingSessionModel
      .deleteMany({ expiresAt: { $lt: new Date() } })
      .exec();
    if (result.deletedCount > 0) {
      this.logger.log(`Cleaned up ${result.deletedCount} expired sessions`);
    }
  }
}
