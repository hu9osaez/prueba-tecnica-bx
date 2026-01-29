export interface Character {
  id: string;
  name: string;
  image: string;
  source: "rick-and-morty" | "pokemon" | "superhero" | "star-wars";
}

export interface Vote {
  characterId: string;
  voteType: "like" | "dislike";
}

export interface VoteResponse {
  success: boolean;
  message?: string;
}

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

export interface PikachuStatsResponse {
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

export interface Statistics {
  mostLiked: MostLikedResponse | null;
  mostDisliked: MostDislikedResponse | null;
  lastEvaluated: LastEvaluatedResponse | null;
  pikachuStats: PikachuStatsResponse | null;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface LoadingStatus {
  isLoading: boolean;
  error: string | null;
  state: LoadingState;
}

export interface ToastState {
  show: boolean;
  voteType: "like" | "dislike";
  characterName: string;
}

export interface TransitionState {
  isTransitioning: boolean;
  direction: "in" | "out" | null;
}
