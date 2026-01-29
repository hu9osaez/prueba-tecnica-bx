"use client";

import { useState, useCallback } from "react";

import { api } from "@/lib/api";
import { saveLastVote, LastVote } from "@/lib/storage";
import { Character } from "@/types";

export interface UseVotingReturn {
  isVoting: boolean;
  error: string | null;
  handleVote: (voteType: "like" | "dislike", character: Character, sessionId?: string | null) => Promise<void>;
  clearError: () => void;
}

export function useVoting(): UseVotingReturn {
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = useCallback(
    async (voteType: "like" | "dislike", character: Character, sessionId?: string | null) => {
      if (!character) return;

      setIsVoting(true);
      setError(null);

      try {
        // Submit vote with sessionId
        await api.votes.submit({
          characterId: character.id,
          voteType,
          sessionId: sessionId || undefined,
        });

        // Save last vote for undo functionality
        const lastVote: LastVote = {
          characterId: character.id,
          characterName: character.name,
          voteType,
          timestamp: Date.now(),
        };
        saveLastVote(lastVote);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit vote");
        throw err; // Re-throw to allow caller to handle
      } finally {
        setIsVoting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isVoting,
    error,
    handleVote,
    clearError,
  };
}
