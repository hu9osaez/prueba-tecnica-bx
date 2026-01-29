import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { VotingSession, VotingSessionSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VotingSession.name, schema: VotingSessionSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
