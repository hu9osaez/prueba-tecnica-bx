import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Vote, VoteSchema } from '../votes/schemas';
import { Character, CharacterSchema } from '../characters/schemas';
import { CharactersModule } from '../characters/characters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vote.name, schema: VoteSchema },
      { name: Character.name, schema: CharacterSchema },
    ]),
    CharactersModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
