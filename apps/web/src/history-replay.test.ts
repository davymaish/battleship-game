import { describe, expect, it } from "vitest";
import {
  createSession,
  fireAt,
  loadChallenge,
  setDifficulty,
} from "./game-controller";
import { replayCurrentGame, shotHistory } from "./history-replay";

const now = new Date("2026-11-23T07:00:00Z");

describe("history and replay", () => {
  it("reconstructs the current game from shot events", () => {
    const session = createSession(now);
    const first = session.game.ships[0]?.cells[0];
    const second = session.game.ships[0]?.cells[1];
    expect(first).toBeDefined();
    expect(second).toBeDefined();

    if (!first || !second) {
      throw new Error("Expected deterministic fixture cells.");
    }

    const played = fireAt(fireAt(session, first), second);
    expect(shotHistory(played)).toHaveLength(2);
    expect(replayCurrentGame(played)).toEqual(played.game);
  });

  it("replays only events after the latest challenge reset", () => {
    const session = createSession(now);
    const first = session.game.ships[0]?.cells[0];
    expect(first).toBeDefined();
    if (!first) {
      throw new Error("Expected deterministic fixture cell.");
    }

    const beforeReset = fireAt(session, first);
    const reset = setDifficulty(beforeReset, "hard");
    const nextCell = reset.game.ships[0]?.cells[0];
    expect(nextCell).toBeDefined();
    if (!nextCell) {
      throw new Error("Expected hard fixture cell.");
    }

    const played = fireAt(reset, nextCell);
    expect(shotHistory(played)).toHaveLength(1);
    expect(replayCurrentGame(played)).toEqual(played.game);
  });

  it("reconstructs a loaded replay challenge", () => {
    const session = loadChallenge(createSession(now), "DC-20261122-0418f8b7");
    const first = session.game.ships[0]?.cells[0];
    expect(first).toBeDefined();
    if (!first) {
      throw new Error("Expected deterministic replay cell.");
    }

    const played = fireAt(session, first);
    expect(replayCurrentGame(played)).toEqual(played.game);
  });
});
