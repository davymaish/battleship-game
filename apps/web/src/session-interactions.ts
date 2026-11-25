import type { Difficulty, Coordinate } from "@battleship/game-core";
import {
  fireAt,
  loadChallenge,
  setDifficulty,
  type GameSession,
} from "./game-controller";

export interface SessionInteractions {
  getSession(): GameSession;
  changeDifficulty(difficulty: Difficulty): GameSession;
  loadReplay(code: string): GameSession;
  fire(coordinate: Coordinate): GameSession;
}

export function createSessionInteractions(
  initialSession: GameSession,
  onChange: (session: GameSession) => void,
): SessionInteractions {
  let session = initialSession;

  function update(next: GameSession): GameSession {
    session = next;
    onChange(session);
    return session;
  }

  return {
    getSession: () => session,
    changeDifficulty: (difficulty) => update(setDifficulty(session, difficulty)),
    loadReplay: (code) => update(loadChallenge(session, code)),
    fire: (coordinate) => update(fireAt(session, coordinate)),
  };
}
