"use client";

import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui";

interface VotingButtonsProps {
  onVote: (voteType: "like" | "dislike") => void;
  isLoading: boolean;
}

export function VotingButtons({ onVote, isLoading }: VotingButtonsProps) {
  return (
    <div className="flex gap-4 justify-center mt-8" aria-busy={isLoading} aria-live="polite">
      <button
        onClick={() => onVote("like")}
        disabled={isLoading}
        className="hud-button hud-font-mono flex items-center gap-2 min-w-[160px] justify-center"
        aria-label="Like this character (Press L)"
        title="Like this character (Press L)"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <ThumbsUp className="w-5 h-5" aria-hidden="true" />
        )}
        <span>LIKE</span>
        {!isLoading && (
          <kbd className="px-2 py-0.5 text-xs font-bold bg-current/20 rounded border border-current">
            L
          </kbd>
        )}
      </button>
      <button
        onClick={() => onVote("dislike")}
        disabled={isLoading}
        className="hud-button hud-font-mono flex items-center gap-2 min-w-[160px] justify-center"
        style={{
          borderColor: 'hsl(var(--hud-neon-magenta))',
          color: 'hsl(var(--hud-neon-magenta))',
        }}
        aria-label="Dislike this character (Press D)"
        title="Dislike this character (Press D)"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <ThumbsDown className="w-5 h-5" aria-hidden="true" />
        )}
        <span>DISLIKE</span>
        {!isLoading && (
          <kbd className="px-2 py-0.5 text-xs font-bold bg-current/20 rounded border border-current">
            D
          </kbd>
        )}
      </button>
    </div>
  );
}
