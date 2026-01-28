import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  characterId: string;

  @IsEnum(['like', 'dislike'])
  voteType: 'like' | 'dislike';
}

export class CreateManualVoteDto {
  @IsString()
  @IsNotEmpty()
  characterName: string;

  @IsEnum(['rick-morty', 'pokemon', 'superhero'])
  source: string;

  @IsEnum(['like', 'dislike'])
  voteType: 'like' | 'dislike';
}
