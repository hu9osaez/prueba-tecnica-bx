import {
  Character,
  MostLikedResponse,
  MostDislikedResponse,
  LastEvaluatedResponse,
  PikachuStatsResponse,
  Statistics,
  Vote,
  VoteResponse,
} from "@/types";
import { buildUrl } from "./utils";
import { getVotedCharacterIds } from "./storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface BackendCharacter {
  id: string;
  externalId: string;
  name: string;
  source: "rick-morty" | "pokemon" | "superhero" | "star-wars";
  imageUrl: string;
}

class ApiError extends Error {
  constructor(public message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new ApiError(error.message || "Request failed", response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error) throw new ApiError(error.message);
    throw new ApiError("An unexpected error occurred");
  }
}

function transformCharacter(backend: BackendCharacter): Character {
  return {
    id: backend.id,
    name: backend.name,
    image: backend.imageUrl, // Map imageUrl -> image
    source:
      backend.source === "rick-morty"
        ? "rick-and-morty"
        : backend.source, // Map rick-morty -> rick-and-morty
  };
}

export const api = {
  characters: {
    getRandom: async (): Promise<Character> => {
      const excludeIds = getVotedCharacterIds();
      const url = buildUrl("/characters/random", {
        excludeIds: excludeIds.length > 0 ? excludeIds.join(',') : undefined,
      });
      const backendChar = await fetcher<BackendCharacter>(url);
      return transformCharacter(backendChar);
    },
  },

  votes: {
    submit: (vote: Vote) =>
      fetcher<VoteResponse>("/votes", {
        method: "POST",
        body: JSON.stringify(vote),
      }),
  },

  statistics: {
    getPikachuStats: () =>
      fetcher<PikachuStatsResponse>("/statistics/pikachu"),

    getAll: async (): Promise<Statistics> => {
      const [mostLiked, mostDisliked, lastEvaluated, pikachuStats] =
        await Promise.allSettled([
          fetcher<MostLikedResponse>("/statistics/most-liked"),
          fetcher<MostDislikedResponse>("/statistics/most-disliked"),
          fetcher<LastEvaluatedResponse>("/statistics/last-evaluated"),
          fetcher<PikachuStatsResponse>("/statistics/pikachu"),
        ]);

      return {
        mostLiked: mostLiked.status === "fulfilled" ? mostLiked.value : null,
        mostDisliked: mostDisliked.status === "fulfilled" ? mostDisliked.value : null,
        lastEvaluated: lastEvaluated.status === "fulfilled" ? lastEvaluated.value : null,
        pikachuStats: pikachuStats.status === "fulfilled" ? pikachuStats.value : null,
      };
    },
  },
};
