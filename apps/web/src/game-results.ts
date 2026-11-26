import type { Difficulty, GamePhase } from "@battleship/game-core";
import type { GameSession } from "./game-controller";
import { calculateSessionStatistics } from "./session-statistics";

export type GameResultOutcome = "won" | "lost";

export interface CompletedGameResult {
  readonly challengeCode: string;
  readonly challengeDate: string;
  readonly difficulty: Difficulty;
  readonly outcome: GameResultOutcome;
  readonly guesses: number;
  readonly accuracy: number;
  readonly completedAt: string;
}

function resultOutcome(phase: GamePhase): GameResultOutcome | null {
  return phase === "won" ? "won" : phase === "lost" ? "lost" : null;
}

export function extractCompletedResult(
  session: GameSession,
  completedAt: Date,
): CompletedGameResult | null {
  const outcome = resultOutcome(session.game.phase);
  if (!outcome || Number.isNaN(completedAt.getTime())) {
    return null;
  }

  const statistics = calculateSessionStatistics(session);
  return {
    challengeCode: session.challenge.details.code,
    challengeDate: session.challenge.details.date,
    difficulty: session.difficulty,
    outcome,
    guesses: statistics.hits + statistics.misses,
    accuracy: statistics.accuracy,
    completedAt: completedAt.toISOString(),
  };
}
