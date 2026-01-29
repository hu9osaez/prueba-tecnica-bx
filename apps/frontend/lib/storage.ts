// LocalStorage keys for tracking voted characters
const VOTED_CHARACTER_IDS_KEY = "voted_character_ids";
const LAST_VOTE_KEY = "last_vote";

export function getVotedCharacterIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(VOTED_CHARACTER_IDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveVotedCharacterId(characterId: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = getVotedCharacterIds();
    if (!ids.includes(characterId)) {
      ids.push(characterId);
      localStorage.setItem(VOTED_CHARACTER_IDS_KEY, JSON.stringify(ids));
    }
  } catch (error) {
    console.error("Failed to save voted character ID:", error);
  }
}

export interface LastVote {
  characterId: string;
  characterName: string;
  voteType: "like" | "dislike";
  timestamp: number;
}

export function getLastVote(): LastVote | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LAST_VOTE_KEY);
    if (!stored) return null;

    const vote = JSON.parse(stored) as LastVote;
    // Only return if within 30 seconds
    if (Date.now() - vote.timestamp < 30000) {
      return vote;
    }
    // Clear old votes
    localStorage.removeItem(LAST_VOTE_KEY);
    return null;
  } catch {
    return null;
  }
}

export function saveLastVote(vote: LastVote): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_VOTE_KEY, JSON.stringify(vote));
  } catch (error) {
    console.error("Failed to save last vote:", error);
  }
}

export function clearLastVote(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LAST_VOTE_KEY);
  } catch (error) {
    console.error("Failed to clear last vote:", error);
  }
}