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

  const accentColor = voteType === "like" ? "hsl(var(--hud-neon-green))" : "hsl(var(--hud-neon-magenta))";
  const borderColor = voteType === "like" ? "hsl(var(--hud-neon-cyan))" : "hsl(var(--hud-neon-magenta))";

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className="hud-panel hud-border-tech hud-glow-cyan px-6 py-4 flex items-center gap-4"
        style={{ borderColor, minWidth: '400px' }}
      >
        <Check className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} aria-hidden="true" />
        <div className="flex-1">
          <p className="font-medium hud-font-mono text-sm">
            [{voteType === "like" ? "LIKE" : "DISLIKE"}] <span className="font-bold text-cyan-400">{characterName.toUpperCase()}</span>
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 hud-font-mono">
            &gt; VOTE_RECORDED_SUCCESSFULLY
          </p>
        </div>
        <button
          onClick={() => {
            onUndo();
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="hud-button hud-font-mono flex items-center gap-2 px-3 py-2 text-xs"
          aria-label="Undo vote"
        >
          <Undo2 className="w-4 h-4" aria-hidden="true" />
          UNDO
        </button>
      </div>
    </div>
  );
}
