import { describe, expect, it } from "vitest";
import { formatWinStreaks } from "./win-streaks-panel";

describe("win streak formatting", () => {
  it("formats current and longest streaks", () => {
    expect(formatWinStreaks({ current: 2, longest: 5 })).toBe("Current streak: 2 · Longest streak: 5");
  });

  it("formats an empty streak history", () => {
    expect(formatWinStreaks({ current: 0, longest: 0 })).toBe("Current streak: 0 · Longest streak: 0");
  });
});
