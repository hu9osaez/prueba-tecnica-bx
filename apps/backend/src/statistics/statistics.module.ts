import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Vote, VoteSchema } from '../votes/schemas';
import { Character, CharacterSchema } from '../characters/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vote.name, schema: VoteSchema },
      { name: Character.name, schema: CharacterSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
