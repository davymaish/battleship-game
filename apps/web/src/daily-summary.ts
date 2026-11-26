import type { CompletedGameResult } from "./game-results";

export interface DailyChallengeSummary {
  readonly games: number;
  readonly wins: number;
  readonly winRate: number;
  readonly averageGuesses: number | null;
}

export function calculateDailyChallengeSummary(
  results: readonly CompletedGameResult[],
): DailyChallengeSummary {
  const wins = results.filter((result) => result.outcome === "won");
  return {
    games: results.length,
    wins: wins.length,
    winRate: results.length === 0 ? 0 : wins.length / results.length,
    averageGuesses: results.length === 0
      ? null
      : results.reduce((total, result) => total + result.guesses, 0) / results.length,
  };
}
