"use client";

import { useState, useEffect, useCallback } from "react";

import { api } from "@/lib/api";
import { Character } from "@/types";

export interface UseCharacterFetchingReturn {
  character: Character | null;
  isLoading: boolean;
  error: string | null;
  fetchCharacter: () => Promise<void>;
  clearError: () => void;
}

export function useCharacterFetching(): UseCharacterFetchingReturn {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = useCallback(async () => {
    try {
      setError(null);
      const newCharacter = await api.characters.getRandom();
      setCharacter(newCharacter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load character");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  return {
    character,
    isLoading,
    error,
    fetchCharacter,
    clearError,
  };
}
