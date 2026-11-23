export interface Coordinate {
  readonly row: number;
  readonly column: number;
}

export interface Ship {
  readonly id: string;
  readonly cells: readonly Coordinate[];
}

export interface GameConfig {
  readonly boardSize: number;
}

export type GamePhase = "setup" | "playing" | "won";
export type ShotOutcome = "hit" | "miss" | "repeat";

export interface GameState {
  readonly config: GameConfig;
  readonly ships: readonly Ship[];
  readonly shots: ReadonlySet<string>;
  readonly phase: GamePhase;
}

export interface ShotResult {
  readonly coordinate: Coordinate;
  readonly outcome: ShotOutcome;
  readonly sunkShipId: string | null;
  readonly shipsRemaining: number;
  readonly phase: GamePhase;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  boardSize: 7,
};

export function coordinateKey(coordinate: Coordinate): string {
  return `${coordinate.row}:${coordinate.column}`;
}

export function isValidCoordinate(coordinate: Coordinate, config: GameConfig = DEFAULT_GAME_CONFIG): boolean {
  return Number.isInteger(coordinate.row)
    && Number.isInteger(coordinate.column)
    && coordinate.row >= 0
    && coordinate.column >= 0
    && coordinate.row < config.boardSize
    && coordinate.column < config.boardSize;
}

export function validateFleet(ships: readonly Ship[], config: GameConfig = DEFAULT_GAME_CONFIG): string[] {
  const errors: string[] = [];
  const occupied = new Set<string>();

  for (const ship of ships) {
    if (ship.cells.length === 0) {
      errors.push(`Ship ${ship.id} must occupy at least one cell.`);
    }

    for (const cell of ship.cells) {
      const key = coordinateKey(cell);
      if (!isValidCoordinate(cell, config)) {
        errors.push(`Ship ${ship.id} contains an invalid coordinate.`);
      }
      if (occupied.has(key)) {
        errors.push(`Fleet contains overlapping cell ${key}.`);
      }
      occupied.add(key);
    }
  }

  return errors;
}

export function createGame(
  ships: readonly Ship[],
  config: GameConfig = DEFAULT_GAME_CONFIG,
): GameState {
  const errors = validateFleet(ships, config);
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  return {
    config,
    ships,
    shots: new Set<string>(),
    phase: "setup",
  };
}

function remainingShips(state: GameState): number {
  return state.ships.filter((ship) => ship.cells.some((cell) => !state.shots.has(coordinateKey(cell)))).length;
}

function shipAt(state: GameState, key: string): Ship | undefined {
  return state.ships.find((ship) => ship.cells.some((cell) => coordinateKey(cell) === key));
}

export function fire(state: GameState, coordinate: Coordinate): { state: GameState; result: ShotResult } {
  if (!isValidCoordinate(coordinate, state.config)) {
    throw new RangeError("Cannot fire outside the board.");
  }

  const key = coordinateKey(coordinate);
  if (state.shots.has(key)) {
    return {
      state,
      result: {
        coordinate,
        outcome: "repeat",
        sunkShipId: null,
        shipsRemaining: remainingShips(state),
        phase: state.phase,
      },
    };
  }

  const shots = new Set(state.shots);
  shots.add(key);
  const hitShip = shipAt(state, key);
  const nextRemaining = remainingShips({ ...state, shots });
  const nextPhase: GamePhase = nextRemaining === 0 ? "won" : "playing";
  const sunkShipId = hitShip && hitShip.cells.every((cell) => shots.has(coordinateKey(cell))) ? hitShip.id : null;
  const nextState: GameState = { ...state, shots, phase: nextPhase };

  return {
    state: nextState,
    result: {
      coordinate,
      outcome: hitShip ? "hit" : "miss",
      sunkShipId,
      shipsRemaining: nextRemaining,
      phase: nextPhase,
    },
  };
}
