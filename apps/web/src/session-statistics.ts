import type { GamePhase } from "@battleship/game-core";
import type { GameSession } from "./game-controller";
import { extractShotHistory } from "./shot-history";

export interface SessionStatistics {
  readonly totalShots: number;
  readonly hits: number;
  readonly misses: number;
  readonly repeats: number;
  readonly blockedShots: number;
  readonly accuracy: number;
  readonly shipsSunk: number;
  readonly shipsRemaining: number;
  readonly shipsToWin: number;
  readonly phase: GamePhase;
}

export function calculateSessionStatistics(session: GameSession): SessionStatistics {
  const history = extractShotHistory(session);
  const hits = history.filter((entry) => entry.outcome === "hit").length;
  const misses = history.filter((entry) => entry.outcome === "miss").length;
  const repeats = history.filter((entry) => entry.outcome === "repeat").length;
  const blockedShots = history.filter((entry) => entry.outcome === "blocked").length;
  const latest = history.at(-1);
  const attempts = hits + misses;

  return {
    totalShots: history.length,
    hits,
    misses,
    repeats,
    blockedShots,
    accuracy: attempts === 0 ? 0 : hits / attempts,
    shipsSunk: latest?.shipsSunk ?? 0,
    shipsRemaining: latest?.shipsRemaining ?? session.game.ships.length,
    shipsToWin: session.game.config.minimumShipsToWin,
    phase: session.game.phase,
  };
}
