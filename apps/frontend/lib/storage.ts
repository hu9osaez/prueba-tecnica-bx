// LocalStorage keys for tracking voted characters
const VOTED_CHARACTER_IDS_KEY = "voted_character_ids";

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