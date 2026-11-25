import { describe, expect, it } from "vitest";
import { createSession, fireAt, loadChallenge } from "./game-controller";
import { extractShotHistory } from "./shot-history";

const now = new Date("2026-11-23T07:00:00Z");

describe("shot history", () => {
  it("extracts ordered entries with gameplay details", () => {
    const initial = createSession(now);
    const shipCell = initial.game.ships[0]?.cells[0];
    expect(shipCell).toBeDefined();
    if (!shipCell) throw new Error("Expected a deterministic ship cell.");

    const session = fireAt(fireAt(initial, shipCell), shipCell);
    const history = extractShotHistory(session);

    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({
      index: 1,
      coordinate: shipCell,
      outcome: "hit",
    });
    expect(history[1]).toMatchObject({
      index: 2,
      coordinate: shipCell,
      outcome: "repeat",
    });
    expect(history[1]?.shipsSunk).toBe(0);
  });

  it("only includes shots from the active challenge and difficulty", () => {
    const initial = createSession(now);
    const firstCell = initial.game.ships[0]?.cells[0];
    expect(firstCell).toBeDefined();
    if (!firstCell) throw new Error("Expected a deterministic ship cell.");

    const previous = fireAt(initial, firstCell);
    const current = loadChallenge(previous, "DC-20261122-0418f8b7");

    expect(extractShotHistory(current)).toEqual([]);
  });
});
