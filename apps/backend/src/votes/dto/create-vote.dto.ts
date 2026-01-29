import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  characterId: string;

  @IsEnum(['like', 'dislike'])
  voteType: 'like' | 'dislike';

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class CreateManualVoteDto {
  @IsString()
  @IsNotEmpty()
  characterName: string;

  @IsEnum(['rick-morty', 'pokemon', 'superhero', 'star-wars'])
  source: string;

  @IsEnum(['like', 'dislike'])
  voteType: 'like' | 'dislike';
}
