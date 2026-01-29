import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { ConfigurationModule } from './config/config.module';
import { CharactersModule } from './characters/characters.module';
import { VotesModule } from './votes/votes.module';
import { StatisticsModule } from './statistics/statistics.module';
import { HealthModule } from './health/health.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule,
    ConfigurationModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time window in milliseconds (60 seconds)
        limit: 100, // Max requests per time window
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        uri:
          process.env.MONGODB_URI ||
          'mongodb://localhost:27017/prueba-tecnica-bx',
      }),
    }),
    CharactersModule,
    VotesModule,
    StatisticsModule,
    HealthModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
