import type { CompletedGameResult } from "./game-results";

export type AchievementId = "first-win" | "hard-win" | "precision-win" | "fast-win";

export interface Achievement {
  readonly id: AchievementId;
  readonly title: string;
  readonly description: string;
}

const DEFINITIONS: readonly Achievement[] = [
  { id: "first-win", title: "First victory", description: "Win your first game." },
  { id: "hard-win", title: "Hard victory", description: "Win a game on hard difficulty." },
  { id: "precision-win", title: "Precision shot", description: "Win with at least 80% accuracy." },
  { id: "fast-win", title: "Fast victory", description: "Win in 6 guesses or fewer." },
];

export function achievementDefinitions(): readonly Achievement[] {
  return DEFINITIONS;
}

export function unlockedAchievements(
  results: readonly CompletedGameResult[],
): readonly Achievement[] {
  const wins = results.filter((result) => result.outcome === "won");
  const unlocked = new Set<AchievementId>();
  if (wins.length > 0) unlocked.add("first-win");
  if (wins.some((result) => result.difficulty === "hard")) unlocked.add("hard-win");
  if (wins.some((result) => result.accuracy >= 0.8)) unlocked.add("precision-win");
  if (wins.some((result) => result.guesses <= 6)) unlocked.add("fast-win");
  return DEFINITIONS.filter((achievement) => unlocked.has(achievement.id));
}
