import { describe, expect, it } from "vitest";
import {
  createGame,
  createRandomGame,
  createSeededRandom,
  expireGame,
  fire,
  generateFleet,
  getDifficultyConfig,
  isValidCoordinate,
  startGame,
  validateFleet,
  type Ship,
} from "./index";

const ships: Ship[] = [
  { id: "alpha", cells: [{ row: 0, column: 0 }, { row: 0, column: 1 }, { row: 0, column: 2 }] },
  { id: "beta", cells: [{ row: 2, column: 2 }, { row: 2, column: 3 }, { row: 2, column: 4 }] },
];

describe("game-core", () => {
  it("validates board coordinates", () => {
    expect(isValidCoordinate({ row: 0, column: 0 })).toBe(true);
    expect(isValidCoordinate({ row: 6, column: 6 })).toBe(true);
    expect(isValidCoordinate({ row: 7, column: 0 })).toBe(false);
    expect(isValidCoordinate({ row: 0, column: -1 })).toBe(false);
  });

  it("rejects overlapping fleet cells", () => {
    const errors = validateFleet([
      { id: "alpha", cells: [{ row: 0, column: 0 }] },
      { id: "beta", cells: [{ row: 0, column: 0 }] },
    ]);
    expect(errors).toContain("Fleet contains overlapping cell 0:0.");
  });

  it("generates deterministic valid fleets for difficulty presets", () => {
    const config = getDifficultyConfig("hard");
    const first = generateFleet(config, createSeededRandom(1234));
    const second = generateFleet(config, createSeededRandom(1234));

    expect(first).toEqual(second);
    expect(first).toHaveLength(config.numShips);
    expect(validateFleet(first, config)).toEqual([]);
  });

  it("records hits, misses, repeated shots, and wins", () => {
    let state = createGame(ships);

    let turn = fire(state, { row: 4, column: 4 });
    expect(turn.result.outcome).toBe("miss");
    expect(turn.result.phase).toBe("playing");
    state = turn.state;

    turn = fire(state, { row: 0, column: 0 });
    expect(turn.result.outcome).toBe("hit");
    expect(turn.result.sunkShipId).toBeNull();
    state = turn.state;

    turn = fire(state, { row: 0, column: 0 });
    expect(turn.result.outcome).toBe("repeat");
    state = turn.state;

    state = fire(state, { row: 0, column: 1 }).state;
    turn = fire(state, { row: 0, column: 2 });
    expect(turn.result.sunkShipId).toBe("alpha");
    expect(turn.result.shipsSunk).toBe(1);
    expect(turn.result.phase).toBe("playing");
    state = turn.state;

    state = fire(state, { row: 2, column: 2 }).state;
    state = fire(state, { row: 2, column: 3 }).state;
    turn = fire(state, { row: 2, column: 4 });
    expect(turn.result.sunkShipId).toBe("beta");
    expect(turn.result.shipsRemaining).toBe(0);
    expect(turn.result.shipsSunk).toBe(2);
    expect(turn.result.phase).toBe("won");
  });

  it("transitions through setup, playing, and expired lifecycle states", () => {
    const setup = createRandomGame("easy", 99);
    expect(setup.phase).toBe("setup");

    const playing = startGame(setup);
    expect(playing.phase).toBe("playing");

    const expired = expireGame(playing);
    expect(expired.phase).toBe("lost");
    expect(fire(expired, { row: 0, column: 0 }).result.outcome).toBe("blocked");
  });
});
