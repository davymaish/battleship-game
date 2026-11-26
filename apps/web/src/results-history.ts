import type { Difficulty } from "@battleship/game-core";
import type { CompletedGameResult } from "./game-results";

export interface ResultsArchive {
  readonly version: 1;
  readonly results: readonly CompletedGameResult[];
}

export const RESULTS_ARCHIVE_LIMIT = 20;

export function createResultsArchive(): ResultsArchive {
  return { version: 1, results: [] };
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "normal" || value === "hard";
}

function isCompletedGameResult(value: unknown): value is CompletedGameResult {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.challengeCode === "string"
    && typeof candidate.challengeDate === "string"
    && isDifficulty(candidate.difficulty)
    && (candidate.outcome === "won" || candidate.outcome === "lost")
    && Number.isInteger(candidate.guesses)
    && (candidate.guesses as number) >= 0
    && typeof candidate.accuracy === "number"
    && Number.isFinite(candidate.accuracy)
    && candidate.accuracy >= 0
    && candidate.accuracy <= 1
    && typeof candidate.completedAt === "string"
    && !Number.isNaN(Date.parse(candidate.completedAt));
}

function resultKey(result: CompletedGameResult): string {
  return `${result.challengeCode}:${result.completedAt}`;
}

export function parseResultsArchive(value: string | null): ResultsArchive | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Record<string, unknown>;
    if (candidate.version !== 1 || !Array.isArray(candidate.results)) return null;
    if (!candidate.results.every(isCompletedGameResult)) return null;
    return {
      version: 1,
      results: candidate.results.slice(0, RESULTS_ARCHIVE_LIMIT),
    };
  } catch {
    return null;
  }
}

export function recordCompletedResult(
  archive: ResultsArchive,
  result: CompletedGameResult,
): ResultsArchive {
  const withoutDuplicate = archive.results.filter((entry) => resultKey(entry) !== resultKey(result));
  return {
    version: 1,
    results: [result, ...withoutDuplicate].slice(0, RESULTS_ARCHIVE_LIMIT),
  };
}
