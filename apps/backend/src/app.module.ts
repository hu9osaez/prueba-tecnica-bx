import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { ConfigurationModule } from './config/config.module';
import { CharactersModule } from './characters/characters.module';
import { VotesModule } from './votes/votes.module';
import { StatisticsModule } from './statistics/statistics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    ConfigurationModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
