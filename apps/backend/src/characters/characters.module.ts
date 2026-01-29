import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { Character, CharacterSchema } from './schemas';
import { ExternalModule } from '../external/external.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
    ]),
    ExternalModule,
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}
