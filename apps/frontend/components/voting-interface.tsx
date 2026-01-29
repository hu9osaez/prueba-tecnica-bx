"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertCircle } from "lucide-react";

import { Character, Statistics } from "@/types";
import { api } from "@/lib/api";
import { saveVotedCharacterId, saveLastVote, clearLastVote, LastVote } from "@/lib/storage";
import { CharacterCard } from "@/components/character-card";
import { StatisticsPanel } from "@/components/statistics-panel";
import { PikachuStatsPanel } from "@/components/pikachu-stats-panel";
import { VotingButtons } from "@/components/voting-buttons";
import { VoteToast } from "@/components/vote-toast";

export function VotingInterface() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const votingButtonsRef = useRef<HTMLDivElement>(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [lastVoteType, setLastVoteType] = useState<"like" | "dislike">("like");
  const [lastVoteCharacter, setLastVoteCharacter] = useState("");

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

  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await api.statistics.getAll();
      setStatistics(stats);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  }, []);

  useEffect(() => {
    fetchCharacter();
    fetchStatistics();
  }, [fetchCharacter, fetchStatistics]);

  // Focus management after transition
  useEffect(() => {
    if (!isTransitioning && !isLoading && character) {
      votingButtonsRef.current?.querySelector("button")?.focus();
    }
  }, [isTransitioning, isLoading, character]);

  // Keyboard shortcuts (L for like, D for dislike)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isVoting || isTransitioning || !character) return;

      if (e.key.toLowerCase() === "l") {
        handleVote("like");
      } else if (e.key.toLowerCase() === "d") {
        handleVote("dislike");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [character, isVoting, isTransitioning]);

  const handleVote = async (voteType: "like" | "dislike") => {
    if (!character || isVoting) return;

    setIsVoting(true);
    setError(null);

    try {
      // Submit vote
      await api.votes.submit({
        characterId: character.id,
        voteType,
      });

      // Save voted character ID to localStorage
      saveVotedCharacterId(character.id);

      // Save last vote for undo functionality
      const lastVote: LastVote = {
        characterId: character.id,
        characterName: character.name,
        voteType,
        timestamp: Date.now(),
      };
      saveLastVote(lastVote);

      // Show toast notification
      setLastVoteType(voteType);
      setLastVoteCharacter(character.name);
      setShowToast(true);

      // Transition animation
      setIsTransitioning(true);

      setTimeout(async () => {
        await fetchCharacter();
        await fetchStatistics();
        setIsTransitioning(false);
        setIsVoting(false);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
      setIsVoting(false);
    }
  };

  const handleUndo = () => {
    // For now, just clear the last vote and show a message
    // Full undo would require backend API to delete the vote
    clearLastVote();
    // In a full implementation, you would call an API to delete the vote
    // and then restore the previous character
    console.log("Undo functionality - would delete last vote via API");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Character Voting
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Vote for your favorite characters! (Press L for Like, D for Dislike)
        </p>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="w-full max-w-md p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <section aria-label="Character selection">
        <div
          className={`transition-all duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          <CharacterCard character={character} isLoading={isLoading} />
          {!isLoading && character && (
            <div ref={votingButtonsRef}>
              <VotingButtons onVote={handleVote} isLoading={isVoting} />
            </div>
          )}
        </div>
      </section>

      <section aria-label="Statistics" aria-live="polite" aria-atomic="true">
        <StatisticsPanel statistics={statistics} isLoading={isLoading} />
        <PikachuStatsPanel stats={statistics?.pikachuStats ?? null} isLoading={isLoading} />
      </section>

      <VoteToast
        show={showToast}
        voteType={lastVoteType}
        characterName={lastVoteCharacter}
        onUndo={handleUndo}
        onDismiss={() => setShowToast(false)}
      />
    </div>
  );
}
