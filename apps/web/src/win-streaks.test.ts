import { describe, expect, it } from "vitest";
import type { CompletedGameResult } from "./game-results";
import { calculateWinStreaks } from "./win-streaks";

function result(outcome: CompletedGameResult["outcome"], index: number): CompletedGameResult {
  return {
    challengeCode: `CODE-${index}`,
    challengeDate: `2026-11-${String(index + 1).padStart(2, "0")}`,
    difficulty: "normal",
    outcome,
    guesses: 10,
    accuracy: outcome === "won" ? 0.8 : 0,
    completedAt: `2026-11-${String(index + 1).padStart(2, "0")}T04:00:00.000Z`,
  };
}

describe("calculateWinStreaks", () => {
  it("returns zeroes for an empty archive", () => {
    expect(calculateWinStreaks([])).toEqual({ current: 0, longest: 0 });
  });

  it("counts the newest consecutive wins and the longest historical run", () => {
    const results = [
      result("won", 5),
      result("won", 4),
      result("lost", 3),
      result("won", 2),
      result("won", 1),
      result("won", 0),
    ];
    expect(calculateWinStreaks(results)).toEqual({ current: 2, longest: 3 });
  });

  it("resets the current streak after the newest loss", () => {
    expect(calculateWinStreaks([result("lost", 2), result("won", 1), result("won", 0)])).toEqual({
      current: 0,
      longest: 2,
    });
  });
});
