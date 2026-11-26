import { describe, expect, it } from "vitest";
import type { CompletedGameResult } from "./game-results";
import { calculatePersonalBests } from "./personal-bests";

function result(overrides: Partial<CompletedGameResult> = {}): CompletedGameResult {
  return {
    challengeCode: "ABC123",
    challengeDate: "2026-11-26",
    difficulty: "normal",
    outcome: "won",
    guesses: 10,
    accuracy: 0.7,
    completedAt: "2026-11-26T04:00:00.000Z",
    ...overrides,
  };
}

describe("calculatePersonalBests", () => {
  it("returns empty bests without wins", () => {
    expect(calculatePersonalBests([result({ outcome: "lost" })])).toEqual({
      fewestGuesses: null,
      highestAccuracy: null,
      hardestWin: null,
    });
  });

  it("selects the best winning records and ignores losses", () => {
    const efficient = result({ guesses: 6, accuracy: 0.8 });
    const precise = result({ guesses: 12, accuracy: 1 });
    const hard = result({ difficulty: "hard", guesses: 14, accuracy: 0.75 });
    expect(calculatePersonalBests([result({ outcome: "lost", guesses: 1, accuracy: 1 }), efficient, precise, hard])).toEqual({
      fewestGuesses: efficient,
      highestAccuracy: precise,
      hardestWin: hard,
    });
  });

  it("prefers the more efficient record when hard difficulty is tied", () => {
    const slower = result({ difficulty: "hard", guesses: 12 });
    const faster = result({ difficulty: "hard", guesses: 8 });
    expect(calculatePersonalBests([slower, faster]).hardestWin).toBe(faster);
  });
});
