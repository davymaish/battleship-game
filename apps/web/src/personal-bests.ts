import type { CompletedGameResult } from "./game-results";

export interface PersonalBests {
  readonly fewestGuesses: CompletedGameResult | null;
  readonly highestAccuracy: CompletedGameResult | null;
  readonly hardestWin: CompletedGameResult | null;
}

export function calculatePersonalBests(
  results: readonly CompletedGameResult[],
): PersonalBests {
  const wins = results.filter((result) => result.outcome === "won");
  return {
    fewestGuesses: wins.reduce((best, result) =>
      !best || result.guesses < best.guesses ? result : best, null as CompletedGameResult | null),
    highestAccuracy: wins.reduce((best, result) =>
      !best || result.accuracy > best.accuracy ? result : best, null as CompletedGameResult | null),
    hardestWin: wins.reduce((best, result) => {
      if (!best) return result;
      if (result.difficulty === "hard" && best.difficulty !== "hard") return result;
      if (result.difficulty === best.difficulty && result.guesses < best.guesses) return result;
      return best;
    }, null as CompletedGameResult | null),
  };
}
