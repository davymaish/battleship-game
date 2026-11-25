import { describe, expect, it } from "vitest";
import { createSession } from "./game-controller";
import { createSessionInteractions } from "./session-interactions";

const now = new Date("2026-11-23T07:00:00Z");

describe("session interactions", () => {
  it("publishes every user action through one change callback", () => {
    const changes: string[] = [];
    const initial = createSession(now);
    const interactions = createSessionInteractions(initial, (session) => {
      changes.push(session.message);
    });

    interactions.changeDifficulty("hard");
    interactions.loadReplay("DC-20261122-0418f8b7");
    const cell = interactions.getSession().game.ships[0]?.cells[0];
    expect(cell).toBeDefined();
    if (!cell) throw new Error("Expected a deterministic ship cell.");
    interactions.fire(cell);

    expect(changes).toEqual([
      "Started hard difficulty.",
      "Loaded Daily challenge — 2026-11-22.",
      "Hit!",
    ]);
    expect(interactions.getSession().game.shots.size).toBe(1);
  });

  it("publishes invalid replay attempts without changing the game", () => {
    const initial = createSession(now);
    const changes: string[] = [];
    const interactions = createSessionInteractions(initial, (session) => {
      changes.push(session.challenge.error ?? session.message);
    });

    const next = interactions.loadReplay("not-a-code");

    expect(next.game).toBe(initial.game);
    expect(changes).toEqual(["That challenge code is not valid."]);
  });
});
