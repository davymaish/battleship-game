export interface Coordinate {
  readonly row: number;
  readonly column: number;
}

export interface Ship {
  readonly id: string;
  readonly cells: readonly Coordinate[];
}

export type Difficulty = "easy" | "normal" | "hard";
export type GamePhase = "setup" | "playing" | "won" | "lost";
export type ShotOutcome = "hit" | "miss" | "repeat" | "blocked";

export interface GameConfig {
  readonly difficulty: Difficulty;
  readonly boardSize: number;
  readonly shipLength: number;
  readonly numShips: number;
  readonly timeLimitSeconds: number;
  readonly minimumShipsToWin: number;
}

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
  readonly shipsSunk: number;
  readonly shipsRemaining: number;
  readonly phase: GamePhase;
}

export interface RandomSource {
  next(): number;
}

export const DIFFICULTY_PRESETS: Readonly<Record<Difficulty, GameConfig>> = {
  easy: {
    difficulty: "easy",
    boardSize: 7,
    shipLength: 3,
    numShips: 2,
    timeLimitSeconds: 90,
    minimumShipsToWin: 1,
  },
  normal: {
    difficulty: "normal",
    boardSize: 7,
    shipLength: 3,
    numShips: 3,
    timeLimitSeconds: 60,
    minimumShipsToWin: 2,
  },
  hard: {
    difficulty: "hard",
    boardSize: 7,
    shipLength: 3,
    numShips: 4,
    timeLimitSeconds: 45,
    minimumShipsToWin: 3,
  },
};

export const DEFAULT_GAME_CONFIG = DIFFICULTY_PRESETS.normal;

export function getDifficultyConfig(difficulty: Difficulty = "normal"): GameConfig {
  return DIFFICULTY_PRESETS[difficulty];
}

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

function isContiguous(cells: readonly Coordinate[]): boolean {
  if (cells.length < 2) {
    return true;
  }

  const sameRow = cells.every((cell) => cell.row === cells[0]?.row);
  const sameColumn = cells.every((cell) => cell.column === cells[0]?.column);
  if (!sameRow && !sameColumn) {
    return false;
  }

  const positions = cells
    .map((cell) => sameRow ? cell.column : cell.row)
    .sort((left, right) => left - right);
  return positions.every((position, index) => {
    const previous = positions[index - 1];
    return index === 0 || (previous !== undefined && position === previous + 1);
  });
}

export function validateFleet(ships: readonly Ship[], config: GameConfig = DEFAULT_GAME_CONFIG): string[] {
  const errors: string[] = [];
  const occupied = new Set<string>();

  for (const ship of ships) {
    if (ship.cells.length === 0) {
      errors.push(`Ship ${ship.id} must occupy at least one cell.`);
    }
    if (ship.cells.length !== config.shipLength) {
      errors.push(`Ship ${ship.id} must occupy ${config.shipLength} cells.`);
    }
    if (!isContiguous(ship.cells)) {
      errors.push(`Ship ${ship.id} must occupy contiguous horizontal or vertical cells.`);
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

  if (ships.length === 0) {
    errors.push("Fleet must contain at least one ship.");
  }
  if (ships.length > config.numShips) {
    errors.push(`Fleet cannot contain more than ${config.numShips} ships.`);
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

export function createSeededRandom(seed: number): RandomSource {
  if (!Number.isFinite(seed)) {
    throw new Error("Random seed must be finite.");
  }

  let state = seed >>> 0;
  return {
    next(): number {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 4294967296;
    },
  };
}

const mathRandom: RandomSource = {
  next: () => Math.random(),
};

function randomInt(random: RandomSource, exclusiveUpperBound: number): number {
  return Math.floor(random.next() * exclusiveUpperBound);
}

function candidateShip(
  id: string,
  config: GameConfig,
  random: RandomSource,
): Ship {
  const horizontal = randomInt(random, 2) === 0;
  const maxRow = horizontal ? config.boardSize : config.boardSize - config.shipLength + 1;
  const maxColumn = horizontal ? config.boardSize - config.shipLength + 1 : config.boardSize;
  const row = randomInt(random, maxRow);
  const column = randomInt(random, maxColumn);
  const cells = Array.from({ length: config.shipLength }, (_, index) => ({
    row: horizontal ? row : row + index,
    column: horizontal ? column + index : column,
  }));
  return { id, cells };
}

export function generateFleet(config: GameConfig = DEFAULT_GAME_CONFIG, random: RandomSource = mathRandom): Ship[] {
  const ships: Ship[] = [];
  const occupied = new Set<string>();
  const maxAttempts = config.boardSize * config.boardSize * 20;
  let attempts = 0;

  while (ships.length < config.numShips && attempts < maxAttempts) {
    attempts += 1;
    const candidate = candidateShip(`ship-${ships.length + 1}`, config, random);
    if (candidate.cells.some((cell) => occupied.has(coordinateKey(cell)))) {
      continue;
    }
    candidate.cells.forEach((cell) => occupied.add(coordinateKey(cell)));
    ships.push(candidate);
  }

  if (ships.length !== config.numShips) {
    throw new Error("Unable to generate a non-overlapping fleet for this configuration.");
  }
  return ships;
}

export function createRandomGame(
  difficulty: Difficulty = "normal",
  seed?: number,
): GameState {
  const config = getDifficultyConfig(difficulty);
  const random = seed === undefined ? mathRandom : createSeededRandom(seed);
  return createGame(generateFleet(config, random), config);
}

function sunkShips(state: GameState): Ship[] {
  return state.ships.filter((ship) => ship.cells.every((cell) => state.shots.has(coordinateKey(cell))));
}

function remainingShips(state: GameState): number {
  return state.ships.length - sunkShips(state).length;
}

function shipAt(state: GameState, key: string): Ship | undefined {
  return state.ships.find((ship) => ship.cells.some((cell) => coordinateKey(cell) === key));
}

export function startGame(state: GameState): GameState {
  return state.phase === "setup" ? { ...state, phase: "playing" } : state;
}

export function expireGame(state: GameState): GameState {
  return state.phase === "setup" || state.phase === "playing" ? { ...state, phase: "lost" } : state;
}

export function fire(state: GameState, coordinate: Coordinate): { state: GameState; result: ShotResult } {
  if (!isValidCoordinate(coordinate, state.config)) {
    throw new RangeError("Cannot fire outside the board.");
  }

  const currentSunkShips = sunkShips(state).length;
  const currentRemainingShips = remainingShips(state);
  if (state.phase === "won" || state.phase === "lost") {
    return {
      state,
      result: {
        coordinate,
        outcome: "blocked",
        sunkShipId: null,
        shipsSunk: currentSunkShips,
        shipsRemaining: currentRemainingShips,
        phase: state.phase,
      },
    };
  }

  const key = coordinateKey(coordinate);
  if (state.shots.has(key)) {
    return {
      state,
      result: {
        coordinate,
        outcome: "repeat",
        sunkShipId: null,
        shipsSunk: currentSunkShips,
        shipsRemaining: currentRemainingShips,
        phase: state.phase,
      },
    };
  }

  const shots = new Set(state.shots);
  shots.add(key);
  const hitShip = shipAt(state, key);
  const nextStateBeforePhase: GameState = { ...state, shots, phase: "playing" };
  const nextSunkShips = sunkShips(nextStateBeforePhase);
  const nextPhase: GamePhase = nextSunkShips.length >= state.config.minimumShipsToWin ? "won" : "playing";
  const nextState: GameState = { ...nextStateBeforePhase, phase: nextPhase };
  const sunkShipId = hitShip && hitShip.cells.every((cell) => shots.has(coordinateKey(cell))) ? hitShip.id : null;

  return {
    state: nextState,
    result: {
      coordinate,
      outcome: hitShip ? "hit" : "miss",
      sunkShipId,
      shipsSunk: nextSunkShips.length,
      shipsRemaining: nextSunkShips.length === state.ships.length ? 0 : remainingShips(nextState),
      phase: nextPhase,
    },
  };
}
