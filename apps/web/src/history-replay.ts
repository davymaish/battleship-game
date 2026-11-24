import {
  fire,
  type GameState,
} from "@battleship/game-core";
import { createGameForChallenge } from "./game-session";
import type { GameSession } from "./game-controller";
import type { SessionEvent, ShotFiredEvent } from "./session-events";

function currentGameEvents(events: readonly SessionEvent[]): readonly SessionEvent[] {
  let resetIndex = 0;
  events.forEach((event, index) => {
    if (event.type === "challenge-started"
      || event.type === "challenge-loaded"
      || event.type === "difficulty-changed") {
      resetIndex = index;
    }
  });
  return events.slice(resetIndex + 1);
}

export function shotHistory(session: GameSession): readonly ShotFiredEvent[] {
  return currentGameEvents(session.events)
    .filter((event): event is ShotFiredEvent => event.type === "shot-fired");
}

export function replayCurrentGame(session: GameSession): GameState {
  return shotHistory(session).reduce(
    (game, event) => fire(game, event.coordinate).state,
    createGameForChallenge(session.challenge.details, session.difficulty),
  );
}
