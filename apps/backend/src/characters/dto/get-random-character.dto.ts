import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetRandomCharacterDto {
  @IsEnum(['rick-morty', 'pokemon', 'superhero', 'star-wars'])
  @IsOptional()
  source?: 'rick-morty' | 'pokemon' | 'superhero' | 'star-wars';

  @IsString()
  @IsOptional()
  excludeIds?: string;

  getExcludeIdsArray(): string[] {
    return this.excludeIds ? this.excludeIds.split(',').filter(Boolean) : [];
  }
}

export interface CharacterResponse {
  id: string;
  externalId: string;
  name: string;
  source: string;
  imageUrl: string;
}
