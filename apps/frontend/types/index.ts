export interface Character {
  id: string;
  name: string;
  image: string;
  source: "rick-and-morty" | "pokemon" | "superhero";
}

export interface Vote {
  characterId: string;
  voteType: "like" | "dislike";
}

export interface VoteResponse {
  success: boolean;
  message?: string;
}

// API Response types - match backend DTOs
export interface MostLikedResponse {
  character: {
    id: string;
    name: string;
    source: string;
    imageUrl: string;
  };
  likes: number;
}

export interface MostDislikedResponse {
  character: {
    id: string;
    name: string;
    source: string;
    imageUrl: string;
  };
  dislikes: number;
}

export interface LastEvaluatedResponse {
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

// Combined statistics type for frontend state
export interface Statistics {
  mostLiked: MostLikedResponse | null;
  mostDisliked: MostDislikedResponse | null;
  lastEvaluated: LastEvaluatedResponse | null;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
