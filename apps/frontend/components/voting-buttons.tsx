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
        className="bg-green-500 hover:bg-green-600 text-white min-w-[120px] animate-scale-down active:scale-95 transition-all"
        aria-label="Like this character"
      >
        <ThumbsUp className="w-5 h-5 mr-2" />
        Like
      </Button>
      <Button
        size="lg"
        onClick={() => onVote("dislike")}
        disabled={isLoading}
        variant="destructive"
        className="bg-red-500 hover:bg-red-600 text-white min-w-[120px] active:scale-95 transition-all"
        aria-label="Dislike this character"
      >
        <ThumbsDown className="w-5 h-5 mr-2" />
        Dislike
      </Button>
    </div>
  );
}
