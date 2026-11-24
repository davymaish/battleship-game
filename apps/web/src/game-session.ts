import {
  createRandomGame,
  type Difficulty,
  type GameState,
} from "@battleship/game-core";
import type { ChallengeDetails } from "@battleship/challenge-core";

export function createGameForChallenge(
  details: ChallengeDetails,
  difficulty: Difficulty = "normal",
): GameState {
  return createRandomGame(difficulty, details.seed);
}
