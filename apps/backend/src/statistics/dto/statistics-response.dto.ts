export class StatisticsCharacterDto {
  id: string;
  name: string;
  source: string;
  imageUrl: string;
}

export class MostLikedResponseDto {
  character: StatisticsCharacterDto;
  likes: number;
}

export class MostDislikedResponseDto {
  character: StatisticsCharacterDto;
  dislikes: number;
}

export class LastEvaluatedResponseDto {
  vote: {
    id: string;
    character: {
      name: string;
      source: string;
      imageUrl: string;
    };
    voteType: string;
    votedAt: string;
  };
}

export class PikachuStatsResponseDto {
  character: {
    name: string;
    source: string;
    exists: boolean;
    imageUrl?: string;
  };

  statistics?: {
    likes: number;
    dislikes: number;
    netScore: number;
    totalVotes: number;
    firstVoteAt: string;
    lastVoteAt: string;
  };
}
