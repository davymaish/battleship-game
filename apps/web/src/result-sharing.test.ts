import { describe, expect, it } from "vitest";
import type { CompletedGameResult } from "./game-results";
import { formatShareSummary, shareCompletedResult, type ShareEnvironment } from "./result-sharing";

const result: CompletedGameResult = {
  challengeCode: "DC-20261123-0418f8b7",
  challengeDate: "2026-11-23",
  difficulty: "hard",
  outcome: "won",
  guesses: 7,
  accuracy: 0.714,
  completedAt: "2026-11-23T07:02:30.000Z",
};

describe("result sharing", () => {
  it("formats a shareable result summary", () => {
    expect(formatShareSummary(result)).toBe("Victory · hard · 7 guesses · 71% accuracy · 2026-11-23 · DC-20261123-0418f8b7");
  });

  it("uses Web Share when available", async () => {
    let payload: { title: string; text: string } | undefined;
    const environment: ShareEnvironment = { share: async (next) => { payload = next; } };
    expect(await shareCompletedResult(result, environment)).toBe("shared");
    expect(payload?.title).toBe("Battleship result");
  });

  it("falls back to clipboard when Web Share is unavailable", async () => {
    let copied = "";
    const environment: ShareEnvironment = { clipboard: { writeText: async (text) => { copied = text; } } };
    expect(await shareCompletedResult(result, environment)).toBe("copied");
    expect(copied).toContain("Victory · hard");
  });

  it("falls back to clipboard after a failed Web Share", async () => {
    let copied = false;
    const environment: ShareEnvironment = {
      share: async () => { throw new Error("cancelled"); },
      clipboard: { writeText: async () => { copied = true; } },
    };
    expect(await shareCompletedResult(result, environment)).toBe("copied");
    expect(copied).toBe(true);
  });

  it("reports unavailable when browser capabilities are absent", async () => {
    expect(await shareCompletedResult(result, {})).toBe("unavailable");
  });
});
