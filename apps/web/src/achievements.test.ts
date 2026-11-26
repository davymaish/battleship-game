import { describe, expect, it } from "vitest";
import { achievementDefinitions, unlockedAchievements } from "./achievements";
import type { CompletedGameResult } from "./game-results";

function result(overrides: Partial<CompletedGameResult> = {}): CompletedGameResult {
  return {
    challengeCode: "DC-20261123-0418f8b7",
    challengeDate: "2026-11-23",
    difficulty: "normal",
    outcome: "lost",
    guesses: 10,
    accuracy: 0.5,
    completedAt: "2026-11-23T07:02:30.000Z",
    ...overrides,
  };
}

describe("achievements", () => {
  it("defines the focused initial achievement set", () => {
    expect(achievementDefinitions().map((achievement) => achievement.id)).toEqual([
      "first-win",
      "hard-win",
      "precision-win",
      "fast-win",
    ]);
  });

  it("unlocks qualifying achievements from wins only", () => {
    const unlocked = unlockedAchievements([
      result({ outcome: "lost", difficulty: "hard", guesses: 3, accuracy: 1 }),
      result({ outcome: "won", difficulty: "hard", guesses: 5, accuracy: 0.9 }),
    ]);

    expect(unlocked.map((achievement) => achievement.id)).toEqual([
      "first-win",
      "hard-win",
      "precision-win",
      "fast-win",
    ]);
  });

  it("returns no achievements for losses and ignores duplicates", () => {
    const unlocked = unlockedAchievements([
      result(),
      result({ ...result(), completedAt: "2026-11-24T07:02:30.000Z" }),
    ]);

    expect(unlocked).toEqual([]);
  });
});
