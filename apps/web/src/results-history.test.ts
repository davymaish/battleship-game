import { describe, expect, it } from "vitest";
import {
  createResultsArchive,
  parseResultsArchive,
  recordCompletedResult,
  RESULTS_ARCHIVE_LIMIT,
} from "./results-history";
import type { CompletedGameResult } from "./game-results";

function result(index: number): CompletedGameResult {
  return {
    challengeCode: `DC-202611${String(index + 1).padStart(2, "0")}-0418f8b7`,
    challengeDate: `2026-11-${String(index + 1).padStart(2, "0")}`,
    difficulty: "normal",
    outcome: index % 2 === 0 ? "won" : "lost",
    guesses: index + 1,
    accuracy: index % 2 === 0 ? 0.75 : 0,
    completedAt: `2026-11-${String(index + 1).padStart(2, "0")}T07:00:00.000Z`,
  };
}

describe("results history", () => {
  it("adds newest results first and removes duplicate identities", () => {
    const first = result(0);
    const archive = recordCompletedResult(recordCompletedResult(createResultsArchive(), first), first);

    expect(archive.results).toEqual([first]);
  });

  it("limits the archive to the most recent results", () => {
    let archive = createResultsArchive();
    for (let index = 0; index < RESULTS_ARCHIVE_LIMIT + 3; index += 1) {
      archive = recordCompletedResult(archive, result(index));
    }

    expect(archive.results).toHaveLength(RESULTS_ARCHIVE_LIMIT);
    expect(archive.results[0]?.challengeDate).toBe("2026-11-23");
  });

  it("parses valid archives and rejects malformed or invalid records", () => {
    const archive = recordCompletedResult(createResultsArchive(), result(0));

    expect(parseResultsArchive(JSON.stringify(archive))).toEqual(archive);
    expect(parseResultsArchive("not-json")).toBeNull();
    expect(parseResultsArchive(JSON.stringify({ version: 2, results: [] }))).toBeNull();
    expect(parseResultsArchive(JSON.stringify({ version: 1, results: [{ ...result(0), accuracy: 2 }] }))).toBeNull();
  });
});
