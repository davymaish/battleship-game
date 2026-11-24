import {
  fire,
  type Difficulty,
  type Coordinate,
  type GameState,
} from "@battleship/game-core";
import {
  currentChallenge,
  resolveChallengeCode,
  type ChallengeViewModel,
} from "./challenge-model";
import { createGameForChallenge } from "./game-session";

export interface GameSession {
  readonly challenge: ChallengeViewModel;
  readonly difficulty: Difficulty;
  readonly game: GameState;
  readonly message: string;
}

export function createSession(
  now: Date = new Date(),
  difficulty: Difficulty = "normal",
): GameSession {
  const challenge = currentChallenge(now);
  return {
    challenge,
    difficulty,
    game: createGameForChallenge(challenge.details, difficulty),
    message: "Choose a coordinate to fire.",
  };
}

export function loadChallenge(session: GameSession, input: string): GameSession {
  const challenge = resolveChallengeCode(input, session.challenge);
  if (challenge.error) {
    return { ...session, challenge };
  }

  return {
    challenge,
    difficulty: session.difficulty,
    game: createGameForChallenge(challenge.details, session.difficulty),
    message: `Loaded ${challenge.details.label}.`,
  };
}

export function setDifficulty(session: GameSession, difficulty: Difficulty): GameSession {
  return {
    ...session,
    difficulty,
    game: createGameForChallenge(session.challenge.details, difficulty),
    message: `Started ${difficulty} difficulty.`,
  };
}

export function fireAt(session: GameSession, coordinate: Coordinate): GameSession {
  const turn = fire(session.game, coordinate);
  const message = turn.result.outcome === "blocked"
    ? "The game is over."
    : turn.result.outcome === "repeat"
    ? "That coordinate was already selected."
    : turn.result.outcome === "hit"
    ? turn.result.sunkShipId
      ? `You sank ${turn.result.sunkShipId}.`
      : "Hit!"
    : "Miss.";

  return {
    ...session,
    game: turn.state,
    message: turn.result.phase === "won" ? "You won!" : message,
  };
}
