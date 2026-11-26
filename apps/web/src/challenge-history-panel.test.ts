import { describe, expect, it } from "vitest";
import { formatChallengeHistoryEntry } from "./challenge-history-panel";

describe("challenge history formatting", () => {
  it("formats a challenge date and code", () => {
    expect(formatChallengeHistoryEntry({ code: "CODE-A", date: "2026-11-26" })).toBe("2026-11-26 · CODE-A");
  });
});
