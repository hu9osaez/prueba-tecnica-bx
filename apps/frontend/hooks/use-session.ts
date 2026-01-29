"use client";

import { useState, useEffect, useCallback } from "react";

import { api } from "@/lib/api";
import { getSessionId, saveSessionId } from "@/lib/storage";

export interface UseSessionReturn {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export function useSession(): UseSessionReturn {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if we have a valid session in storage
      const existingSessionId = getSessionId();

      if (existingSessionId) {
        setSessionId(existingSessionId);
        setIsLoading(false);
        return;
      }

      // Create new session
      const session = await api.sessions.create();
      saveSessionId(session.sessionId, session.expiresAt);
      setSessionId(session.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize session");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return {
    sessionId,
    isLoading,
    error,
    refreshSession,
    clearError,
  };
}
