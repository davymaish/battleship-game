import {
  fire,
  type Coordinate,
  type GamePhase,
  type ShotOutcome,
} from "@battleship/game-core";
import type { GameSession } from "./game-controller";
import { createGameForChallenge } from "./game-session";
import { shotHistory as currentGameShotEvents } from "./history-replay";

export interface ShotHistoryEntry {
  readonly index: number;
  readonly coordinate: Coordinate;
  readonly outcome: ShotOutcome;
  readonly phase: GamePhase;
  readonly sunkShipId: string | null;
  readonly shipsSunk: number;
  readonly shipsRemaining: number;
}

export function extractShotHistory(session: GameSession): readonly ShotHistoryEntry[] {
  let game = createGameForChallenge(session.challenge.details, session.difficulty);

  return currentGameShotEvents(session).map((event, index) => {
    const turn = fire(game, event.coordinate);
    game = turn.state;
    return {
      index: index + 1,
      coordinate: event.coordinate,
      outcome: turn.result.outcome,
      phase: turn.result.phase,
      sunkShipId: turn.result.sunkShipId,
      shipsSunk: turn.result.shipsSunk,
      shipsRemaining: turn.result.shipsRemaining,
    };
  });
}
