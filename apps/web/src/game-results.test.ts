import { describe, expect, it } from "vitest";
import { expireGame } from "@battleship/game-core";
import { createSession, fireAt } from "./game-controller";
import { extractCompletedResult } from "./game-results";

const now = new Date("2026-11-23T07:00:00Z");
const completedAt = new Date("2026-11-23T07:02:30Z");

describe("completed game results", () => {
  it("returns null while a session is still active", () => {
    expect(extractCompletedResult(createSession(now), completedAt)).toBeNull();
  });

  it("extracts a winning result with challenge and score metadata", () => {
    let session = createSession(now);
    const winningCells = session.game.ships
      .slice(0, session.game.config.minimumShipsToWin)
      .flatMap((ship) => ship.cells);

    for (const cell of winningCells) {
      session = fireAt(session, cell);
    }

    expect(extractCompletedResult(session, completedAt)).toEqual({
      challengeCode: session.challenge.details.code,
      challengeDate: "2026-11-23",
      difficulty: "normal",
      outcome: "won",
      guesses: winningCells.length,
      accuracy: 1,
      completedAt: "2026-11-23T07:02:30.000Z",
    });
  });

  it("extracts a loss result and rejects invalid completion timestamps", () => {
    const session = createSession(now);
    const lostSession = { ...session, game: expireGame(session.game) };

    expect(extractCompletedResult(lostSession, completedAt)).toMatchObject({
      outcome: "lost",
      guesses: 0,
      accuracy: 0,
    });
    expect(extractCompletedResult(lostSession, new Date("invalid"))).toBeNull();
  });
});
