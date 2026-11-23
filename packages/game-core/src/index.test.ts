import { describe, expect, it } from "vitest";
import {
  createGame,
  fire,
  isValidCoordinate,
  validateFleet,
  type Ship,
} from "./index";

const ships: Ship[] = [
  { id: "alpha", cells: [{ row: 0, column: 0 }, { row: 0, column: 1 }] },
  { id: "beta", cells: [{ row: 2, column: 2 }] },
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
    turn = fire(state, { row: 2, column: 2 });
    expect(turn.result.sunkShipId).toBe("beta");
    expect(turn.result.shipsRemaining).toBe(0);
    expect(turn.result.phase).toBe("won");
  });
});
