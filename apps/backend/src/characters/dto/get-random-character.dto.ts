import { IsEnum, IsOptional } from 'class-validator';

export class GetRandomCharacterDto {
  @IsEnum(['rick-morty', 'pokemon', 'superhero'])
  @IsOptional()
  source?: 'rick-morty' | 'pokemon' | 'superhero';
}

export interface CharacterResponse {
  id: string;
  externalId: string;
  name: string;
  source: string;
  imageUrl: string;
}
