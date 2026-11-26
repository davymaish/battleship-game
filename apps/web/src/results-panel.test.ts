import { describe, expect, it } from "vitest";
import { formatCompletedResult } from "./results-panel";
import type { CompletedGameResult } from "./game-results";

const result: CompletedGameResult = {
  challengeCode: "DC-20261123-0418f8b7",
  challengeDate: "2026-11-23",
  difficulty: "hard",
  outcome: "won",
  guesses: 7,
  accuracy: 0.714,
  completedAt: "2026-11-23T07:02:30.000Z",
};

describe("results panel formatting", () => {
  it("formats a readable victory summary", () => {
    expect(formatCompletedResult(result)).toBe("Victory · hard · 7 guesses · 71% accuracy");
  });

  it("formats losses distinctly", () => {
    expect(formatCompletedResult({ ...result, outcome: "lost", accuracy: 0 })).toBe("Loss · hard · 7 guesses · 0% accuracy");
  });
});
