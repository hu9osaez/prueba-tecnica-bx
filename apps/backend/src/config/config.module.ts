import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
      envFilePath: ['.env'],
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
