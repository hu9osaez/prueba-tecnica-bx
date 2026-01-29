// LocalStorage keys for tracking voting session
const SESSION_ID_KEY = "voting_session_id";
const SESSION_EXPIRES_KEY = "voting_session_expires";
const LAST_VOTE_KEY = "last_vote";

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    const expires = localStorage.getItem(SESSION_EXPIRES_KEY);

    if (!sessionId || !expires) return null;

    // Check if session is expired
    if (Date.now() > parseInt(expires, 10)) {
      clearSession();
      return null;
    }

    return sessionId;
  } catch {
    return null;
  }
}

export function saveSessionId(sessionId: string, expiresAt: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(SESSION_EXPIRES_KEY, new Date(expiresAt).getTime().toString());
  } catch (error) {
    console.error("Failed to save session ID:", error);
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_EXPIRES_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

// Deprecated: Kept for backward compatibility
export function getVotedCharacterIds(): string[] {
  return [];
}

export function saveVotedCharacterId(_characterId: string): void {
  // No-op: session handles this now
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