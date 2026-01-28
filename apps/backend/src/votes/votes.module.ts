import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { Vote, VoteSchema } from './schemas';
import { CharactersModule } from '../characters/characters.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
    CharactersModule,
  ],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}
