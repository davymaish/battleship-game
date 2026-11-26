import { describe, expect, it } from "vitest";
import { formatDailyChallengeSummary } from "./daily-summary-panel";

describe("daily challenge summary formatting", () => {
  it("formats empty history", () => {
    expect(formatDailyChallengeSummary({ games: 0, wins: 0, winRate: 0, averageGuesses: null })).toBe("No completed daily challenges yet.");
  });

  it("formats populated metrics", () => {
    expect(formatDailyChallengeSummary({ games: 3, wins: 2, winRate: 2 / 3, averageGuesses: 10 })).toBe("3 games · 2 wins · 67% win rate · 10.0 average guesses");
  });
});
