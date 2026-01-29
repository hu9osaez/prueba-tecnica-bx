"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AlertCircle } from "lucide-react";

import { useVoting, useCharacterFetching, useStatistics, useKeyboardShortcuts, useSession } from "@/hooks";
import { clearLastVote } from "@/lib/storage";
import { CharacterCard } from "@/components/character-card";
import { StatisticsPanel } from "@/components/statistics-panel";
import { PikachuStatsPanel } from "@/components/pikachu-stats-panel";
import { VotingButtons } from "@/components/voting-buttons";
import { VoteToast } from "@/components/vote-toast";

export function VotingInterface() {
  const session = useSession();
  const character = useCharacterFetching();
  const statistics = useStatistics();
  const voting = useVoting();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVoteType, setToastVoteType] = useState<"like" | "dislike">("like");
  const [toastCharacterName, setToastCharacterName] = useState("");
  const votingButtonsRef = useRef<HTMLDivElement>(null);

  const isLoading = session.isLoading || character.isLoading || statistics.isLoading;

  useKeyboardShortcuts({
    onLike: () => handleVote("like"),
    onDislike: () => handleVote("dislike"),
    isEnabled: !voting.isVoting && !isTransitioning && !!character.character && !!session.sessionId,
  });

  useEffect(() => {
    if (!isTransitioning && !isLoading && character.character) {
      votingButtonsRef.current?.querySelector("button")?.focus();
    }
  }, [isTransitioning, isLoading, character.character]);

  const handleVote = useCallback(async (voteType: "like" | "dislike") => {
    if (!character.character || voting.isVoting || !session.sessionId) return;

    try {
      await voting.handleVote(voteType, character.character, session.sessionId);

      // Show toast notification
      setToastVoteType(voteType);
      setToastCharacterName(character.character.name);
      setShowToast(true);

      // Transition animation
      setIsTransitioning(true);

      setTimeout(async () => {
        await Promise.all([
          character.fetchCharacter(),
          statistics.fetchStatistics(),
        ]);
        setIsTransitioning(false);
      }, 300);
    } catch {
      // Error handled by useVoting hook
    }
  }, [character, statistics, voting, session]);

  const handleUndo = useCallback(() => {
    clearLastVote();
    setShowToast(false);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 hud-font-mono hud-text-glow">
          &gt; CHARACTER_VOTING_SYSTEM_
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 hud-font-mono text-sm">
          [L] LIKE  |  [D] DISLIKE
        </p>
      </div>

      {(session.error || voting.error || character.error) && (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full max-w-4xl mx-auto p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-400 dark:border-red-600 hud-font-mono flex items-center gap-3 hud-border-tech"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-800 dark:text-red-200">
            ERROR: {session.error || voting.error || character.error}
          </p>
        </div>
      )}

      {/* Horizontal Layout: Voting (Left) | Stats (Right) */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        {/* Left Panel: Voting Section */}
        <section
          aria-label="Character selection"
          className="flex-1 lg:max-w-[65%] hud-panel hud-border-tech p-6"
        >
          <div
            className={`transition-all duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          >
            <CharacterCard character={character.character} isLoading={character.isLoading} />
            {!character.isLoading && character.character && (
              <div ref={votingButtonsRef}>
                <VotingButtons onVote={handleVote} isLoading={voting.isVoting} />
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Stats Section */}
        <section
          aria-label="Statistics"
          aria-live="polite"
          aria-atomic="true"
          className="lg:max-w-[35%] hud-panel hud-border-tech p-6 space-y-4"
        >
          <StatisticsPanel statistics={statistics.statistics} isLoading={statistics.isLoading} />
          <PikachuStatsPanel stats={statistics.statistics?.pikachuStats ?? null} isLoading={statistics.isLoading} />
        </section>
      </div>

      <VoteToast
        show={showToast}
        voteType={toastVoteType}
        characterName={toastCharacterName}
        onUndo={handleUndo}
        onDismiss={() => setShowToast(false)}
      />
    </div>
  );
}
