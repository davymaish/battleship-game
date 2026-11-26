import { describe, expect, it } from "vitest";
import type { CompletedGameResult } from "./game-results";
import { formatPersonalBest } from "./personal-bests-panel";

const result: CompletedGameResult = {
  challengeCode: "ABC123",
  challengeDate: "2026-11-26",
  difficulty: "hard",
  outcome: "won",
  guesses: 8,
  accuracy: 0.875,
  completedAt: "2026-11-26T04:00:00.000Z",
};

describe("personal best formatting", () => {
  it("formats an available best", () => {
    expect(formatPersonalBest("Fewest guesses", result)).toBe("Fewest guesses: Victory · hard · 8 guesses · 88% accuracy");
  });

  it("formats an unavailable best", () => {
    expect(formatPersonalBest("Highest accuracy", null)).toBe("Highest accuracy: No victories yet");
  });
});
