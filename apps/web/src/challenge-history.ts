import type { CompletedGameResult } from "./game-results";

export interface ChallengeHistoryEntry {
  readonly code: string;
  readonly date: string;
}

export const CHALLENGE_HISTORY_LIMIT = 10;

export function collectChallengeHistory(
  results: readonly CompletedGameResult[],
  limit = CHALLENGE_HISTORY_LIMIT,
): readonly ChallengeHistoryEntry[] {
  const seen = new Set<string>();
  const history: ChallengeHistoryEntry[] = [];
  for (const result of results) {
    if (seen.has(result.challengeCode)) continue;
    seen.add(result.challengeCode);
    history.push({ code: result.challengeCode, date: result.challengeDate });
    if (history.length >= limit) break;
  }
  return history;
}
