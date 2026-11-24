import {
  createRandomGame,
  type GameState,
} from "@battleship/game-core";
import type { ChallengeDetails } from "@battleship/challenge-core";

export function createGameForChallenge(details: ChallengeDetails): GameState {
  return createRandomGame("normal", details.seed);
}
