"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";

import { Button } from "@/components/ui";

interface VotingButtonsProps {
  onVote: (voteType: "like" | "dislike") => void;
  isLoading: boolean;
}

export function VotingButtons({ onVote, isLoading }: VotingButtonsProps) {
  return (
    <div className="flex gap-4 justify-center mt-8">
      <Button
        size="lg"
        onClick={() => onVote("like")}
        disabled={isLoading}
        className="bg-like hover:bg-like-hover text-white min-w-[140px] active:scale-95 shadow-md hover:shadow-lg"
        aria-label="Like this character (Press L)"
        title="Like this character (Press L)"
      >
        <ThumbsUp className="w-5 h-5 mr-2" aria-hidden="true" />
        Like
        <kbd className="ml-2 px-2 py-0.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded border border-white/30">
          L
        </kbd>
      </Button>
      <Button
        size="lg"
        onClick={() => onVote("dislike")}
        disabled={isLoading}
        className="bg-dislike hover:bg-dislike-hover text-white min-w-[140px] active:scale-95 shadow-md hover:shadow-lg"
        aria-label="Dislike this character (Press D)"
        title="Dislike this character (Press D)"
      >
        <ThumbsDown className="w-5 h-5 mr-2" aria-hidden="true" />
        Dislike
        <kbd className="ml-2 px-2 py-0.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded border border-white/30">
          D
        </kbd>
      </Button>
    </div>
  );
}
