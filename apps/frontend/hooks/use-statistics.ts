"use client";

import { useState, useEffect, useCallback } from "react";

import { api } from "@/lib/api";
import { Statistics } from "@/types";

export interface UseStatisticsReturn {
  statistics: Statistics | null;
  isLoading: boolean;
  error: string | null;
  fetchStatistics: () => Promise<void>;
  clearError: () => void;
}

export function useStatistics(): UseStatisticsReturn {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setError(null);
      const stats = await api.statistics.getAll();
      setStatistics(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    fetchStatistics,
    clearError,
  };
}
