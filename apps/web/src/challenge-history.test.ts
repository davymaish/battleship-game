import { describe, expect, it } from "vitest";
import type { CompletedGameResult } from "./game-results";
import { collectChallengeHistory } from "./challenge-history";

function result(code: string, date: string): CompletedGameResult {
  return {
    challengeCode: code,
    challengeDate: date,
    difficulty: "normal",
    outcome: "won",
    guesses: 8,
    accuracy: 0.8,
    completedAt: `${date}T04:00:00.000Z`,
  };
}

describe("collectChallengeHistory", () => {
  it("keeps newest distinct challenge codes in archive order", () => {
    expect(collectChallengeHistory([
      result("CODE-B", "2026-11-26"),
      result("CODE-A", "2026-11-25"),
      result("CODE-B", "2026-11-26"),
    ])).toEqual([
      { code: "CODE-B", date: "2026-11-26" },
      { code: "CODE-A", date: "2026-11-25" },
    ]);
  });

  it("applies a caller-provided limit", () => {
    expect(collectChallengeHistory([
      result("A", "2026-11-26"),
      result("B", "2026-11-25"),
      result("C", "2026-11-24"),
    ], 2)).toHaveLength(2);
  });
});
