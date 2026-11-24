import {
  fire,
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
  readonly game: GameState;
  readonly message: string;
}

export function createSession(now: Date = new Date()): GameSession {
  const challenge = currentChallenge(now);
  return {
    challenge,
    game: createGameForChallenge(challenge.details),
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
    game: createGameForChallenge(challenge.details),
    message: `Loaded ${challenge.details.label}.`,
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
