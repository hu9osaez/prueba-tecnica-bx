import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { ExternalService } from './external.service';
import { RickAndMortyClient, PokemonClient, SuperheroClient } from './clients';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    ExternalService,
    RickAndMortyClient,
    PokemonClient,
    SuperheroClient,
  ],
  exports: [ExternalService, PokemonClient],
})
export class ExternalModule {}
