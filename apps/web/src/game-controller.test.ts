import { describe, expect, it } from "vitest";
import {
  createSession,
  fireAt,
  loadChallenge,
} from "./game-controller";

const now = new Date("2026-11-23T07:00:00Z");

describe("game controller", () => {
  it("starts a challenge-backed session with a playable game", () => {
    const session = createSession(now);

    expect(session.challenge.details.date).toBe("2026-11-23");
    expect(session.game.phase).toBe("setup");
    expect(session.game.shots.size).toBe(0);
    expect(session.message).toBe("Choose a coordinate to fire.");
  });

  it("preserves the game when a replay code is invalid", () => {
    const session = createSession(now);
    const next = loadChallenge(session, "not-a-code");

    expect(next.game).toBe(session.game);
    expect(next.challenge.error).toBe("That challenge code is not valid.");
  });

  it("resets the game when a valid replay code is loaded", () => {
    const session = createSession(now);
    const next = loadChallenge(session, "DC-20261122-0418f8b7");

    expect(next.challenge.details.date).toBe("2026-11-22");
    expect(next.game).not.toBe(session.game);
    expect(next.game.shots.size).toBe(0);
    expect(next.message).toBe("Loaded Daily challenge — 2026-11-22.");
  });

  it("updates the session message after firing", () => {
    const session = createSession(now);
    const firstCell = session.game.ships[0]?.cells[0];
    expect(firstCell).toBeDefined();

    if (!firstCell) {
      throw new Error("Expected the deterministic fixture to contain a ship.");
    }

    const next = fireAt(session, firstCell);
    expect(next.game.shots.size).toBe(1);
    expect(next.message).toBe("Hit!");
  });
});
