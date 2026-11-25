import { describe, expect, it } from "vitest";
import { createSession, fireAt } from "./game-controller";
import { calculateSessionStatistics } from "./session-statistics";

const now = new Date("2026-11-23T07:00:00Z");

describe("session statistics", () => {
  it("starts with empty attempts and the configured fleet target", () => {
    const session = createSession(now);

    expect(calculateSessionStatistics(session)).toEqual({
      totalShots: 0,
      hits: 0,
      misses: 0,
      repeats: 0,
      blockedShots: 0,
      accuracy: 0,
      shipsSunk: 0,
      shipsRemaining: session.game.ships.length,
      shipsToWin: session.game.config.minimumShipsToWin,
      phase: "setup",
    });
  });

  it("counts hits, misses, repeats, and accuracy separately", () => {
    const initial = createSession(now);
    const shipCell = initial.game.ships[0]?.cells[0];
    expect(shipCell).toBeDefined();
    if (!shipCell) throw new Error("Expected a deterministic ship cell.");

    const occupied = new Set(initial.game.ships.flatMap((ship) => ship.cells.map((cell) => `${cell.row}:${cell.column}`)));
    const miss = Array.from({ length: initial.game.config.boardSize ** 2 }, (_, index) => ({
      row: Math.floor(index / initial.game.config.boardSize),
      column: index % initial.game.config.boardSize,
    })).find((cell) => !occupied.has(`${cell.row}:${cell.column}`));
    expect(miss).toBeDefined();
    if (!miss) throw new Error("Expected an unoccupied deterministic cell.");
    const session = fireAt(fireAt(fireAt(initial, shipCell), miss), shipCell);
    const statistics = calculateSessionStatistics(session);

    expect(statistics.totalShots).toBe(3);
    expect(statistics.hits).toBe(1);
    expect(statistics.misses).toBe(1);
    expect(statistics.repeats).toBe(1);
    expect(statistics.accuracy).toBe(0.5);
    expect(statistics.phase).toBe("playing");
  });

  it("reports terminal progress and blocked shots", () => {
    const initial = createSession(now);
    let session = initial;
    const winningCells = initial.game.ships
      .slice(0, initial.game.config.minimumShipsToWin)
      .flatMap((ship) => ship.cells);

    for (const cell of winningCells) {
      session = fireAt(session, cell);
    }
    session = fireAt(session, { row: 0, column: 0 });
    const statistics = calculateSessionStatistics(session);

    expect(statistics.phase).toBe("won");
    expect(statistics.shipsSunk).toBe(initial.game.config.minimumShipsToWin);
    expect(statistics.blockedShots).toBe(1);
    expect(statistics.shipsRemaining).toBeGreaterThanOrEqual(0);
  });
});
