"use client";

import { useEffect, useRef, useCallback } from "react";

export interface UseKeyboardShortcutsOptions {
  onLike?: () => void;
  onDislike?: () => void;
  isEnabled?: boolean;
}


export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions) {
  const { onLike, onDislike, isEnabled = true } = options;
  const isActiveRef = useRef(isEnabled);

  useEffect(() => {
    isActiveRef.current = isEnabled;
  }, [isEnabled]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!isActiveRef.current) return;

      // Check for L (like) or D (dislike)
      const key = e.key.toLowerCase();

      if (key === "l" && onLike) {
        e.preventDefault();
        onLike();
      } else if (key === "d" && onDislike) {
        e.preventDefault();
        onDislike();
      }
    },
    [onLike, onDislike]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return {};
}
