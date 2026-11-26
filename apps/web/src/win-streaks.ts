import type { CompletedGameResult } from "./game-results";

export interface WinStreaks {
  readonly current: number;
  readonly longest: number;
}

export function calculateWinStreaks(results: readonly CompletedGameResult[]): WinStreaks {
  let current = 0;
  for (const result of results) {
    if (result.outcome !== "won") break;
    current += 1;
  }

  let longest = 0;
  let run = 0;
  for (const result of [...results].reverse()) {
    run = result.outcome === "won" ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  return { current, longest };
}
