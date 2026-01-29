"use client";

import { Check, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";

interface VoteToastProps {
  show: boolean;
  voteType: "like" | "dislike";
  characterName: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export function VoteToast({ show, voteType, characterName, onUndo, onDismiss }: VoteToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  const bgColor = voteType === "like" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4`}>
        <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-medium">
            {voteType === "like" ? "Liked" : "Disliked"} <span className="font-bold">{characterName}</span>
          </p>
          <p className="text-sm opacity-90">Vote recorded successfully</p>
        </div>
        <button
          onClick={() => {
            onUndo();
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded transition-colors text-sm font-medium"
          aria-label="Undo vote"
        >
          <Undo2 className="w-4 h-4" aria-hidden="true" />
          Undo
        </button>
      </div>
    </div>
  );
}
