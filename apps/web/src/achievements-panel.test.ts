import { describe, expect, it } from "vitest";
import { formatAchievementStatus } from "./achievements-panel";
import type { Achievement } from "./achievements";

const achievement: Achievement = {
  id: "first-win",
  title: "First victory",
  description: "Win your first game.",
};

describe("achievements panel formatting", () => {
  it("formats locked achievements", () => {
    expect(formatAchievementStatus(achievement, false)).toBe("Locked: First victory — Win your first game.");
  });

  it("formats unlocked achievements", () => {
    expect(formatAchievementStatus(achievement, true)).toBe("Unlocked: First victory — Win your first game.");
  });
});
