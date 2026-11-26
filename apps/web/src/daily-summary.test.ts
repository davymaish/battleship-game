import { describe, expect, it } from "vitest";
import type { CompletedGameResult } from "./game-results";
import { calculateDailyChallengeSummary } from "./daily-summary";

function result(outcome: CompletedGameResult["outcome"], guesses: number): CompletedGameResult {
  return {
    challengeCode: "CODE",
    challengeDate: "2026-11-26",
    difficulty: "normal",
    outcome,
    guesses,
    accuracy: outcome === "won" ? 0.8 : 0,
    completedAt: "2026-11-26T04:00:00.000Z",
  };
}

describe("calculateDailyChallengeSummary", () => {
  it("returns empty metrics without completed games", () => {
    expect(calculateDailyChallengeSummary([])).toEqual({
      games: 0,
      wins: 0,
      winRate: 0,
      averageGuesses: null,
    });
  });

  it("counts games, wins, rate, and average guesses", () => {
    expect(calculateDailyChallengeSummary([result("won", 8), result("lost", 12), result("won", 10)])).toEqual({
      games: 3,
      wins: 2,
      winRate: 2 / 3,
      averageGuesses: 10,
    });
  });
});
