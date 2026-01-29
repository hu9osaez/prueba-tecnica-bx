import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configuration from environment
  const port = process.env.PORT || 3000;
  const apiPrefix = process.env.API_PREFIX || 'api';
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'];

  // Set API prefix
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  console.log(`Server running on: http://localhost:${port}`);
  console.log(`Health Check: http://localhost:${port}/${apiPrefix}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
