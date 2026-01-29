import {
  Character,
  MostLikedResponse,
  MostDislikedResponse,
  LastEvaluatedResponse,
  Statistics,
  Vote,
  VoteResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new ApiError(error.message || "Request failed", response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error) throw new ApiError(error.message);
    throw new ApiError("An unexpected error occurred");
  }
}

export const api = {
  characters: {
    getRandom: () => fetcher<Character>(`/characters/random`),
  },

  votes: {
    submit: (vote: Vote) =>
      fetcher<VoteResponse>("/votes", {
        method: "POST",
        body: JSON.stringify(vote),
      }),
  },

  statistics: {
    getMostLiked: () => fetcher<MostLikedResponse>("/statistics/most-liked"),
    getMostDisliked: () => fetcher<MostDislikedResponse>("/statistics/most-disliked"),
    getLastEvaluated: () => fetcher<LastEvaluatedResponse>("/statistics/last-evaluated"),

    // Convenience method to fetch all statistics in parallel
    getAll: async (): Promise<Statistics> => {
      const [mostLiked, mostDisliked, lastEvaluated] = await Promise.allSettled([
        fetcher<MostLikedResponse>("/statistics/most-liked"),
        fetcher<MostDislikedResponse>("/statistics/most-disliked"),
        fetcher<LastEvaluatedResponse>("/statistics/last-evaluated"),
      ]);

      return {
        mostLiked: mostLiked.status === "fulfilled" ? mostLiked.value : null,
        mostDisliked: mostDisliked.status === "fulfilled" ? mostDisliked.value : null,
        lastEvaluated: lastEvaluated.status === "fulfilled" ? lastEvaluated.value : null,
      };
    },
  },
};
