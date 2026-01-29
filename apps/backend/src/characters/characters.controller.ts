import { Controller, Get, NotFoundException, Query } from '@nestjs/common';

import { CharactersService } from './characters.service';
import { GetRandomCharacterDto, CharacterResponse } from './dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('random')
  async getRandomCharacter(
    @Query() query: GetRandomCharacterDto,
  ): Promise<CharacterResponse> {
    const character = await this.charactersService.getRandomCharacter(
      query.source,
    );

    if (!character) {
      throw new NotFoundException('No characters available');
    }

    return {
      id: character._id.toString(),
      externalId: character.externalId,
      name: character.name,
      source: character.source,
      imageUrl: character.imageUrl,
    };
  }

  @Get()
  async findAll(): Promise<CharacterResponse[]> {
    const characters = await this.charactersService.findAll();

    return characters.map((c) => ({
      id: c._id.toString(),
      externalId: c.externalId,
      name: c.name,
      source: c.source,
      imageUrl: c.imageUrl,
    }));
  }
}
