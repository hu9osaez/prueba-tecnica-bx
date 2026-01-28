import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MongooseModule } from '@nestjs/mongoose';

import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/prueba-tecnica-bx',
    ),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
