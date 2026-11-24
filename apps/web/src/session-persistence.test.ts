import { describe, expect, it } from "vitest";
import { createSession, fireAt } from "./game-controller";
import {
  createLocalSessionStore,
  createMemorySessionStore,
  parseSnapshot,
  snapshotFromSession,
  type StorageLike,
} from "./session-persistence";

const now = new Date("2026-11-23T07:00:00Z");

function fakeStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
}

describe("session persistence", () => {
  it("creates a serializable snapshot from a session", () => {
    const session = createSession(now, "hard");
    const first = session.game.ships[0]?.cells[0];
    expect(first).toBeDefined();
    if (!first) {
      throw new Error("Expected deterministic fixture cell.");
    }

    const snapshot = snapshotFromSession(fireAt(session, first));
    expect(snapshot.version).toBe(1);
    expect(snapshot.challengeCode).toBe("DC-20261123-0318f724");
    expect(snapshot.difficulty).toBe("hard");
    expect(snapshot.events).toHaveLength(2);
    expect(parseSnapshot(JSON.stringify(snapshot))).toEqual(snapshot);
  });

  it("round-trips through memory and local-style stores", () => {
    const snapshot = snapshotFromSession(createSession(now));
    const memory = createMemorySessionStore();
    memory.write(snapshot);
    expect(memory.read()).toEqual(snapshot);
    memory.clear();
    expect(memory.read()).toBeNull();

    const local = createLocalSessionStore(fakeStorage(), "test-session");
    local.write(snapshot);
    expect(local.read()).toEqual(snapshot);
    local.clear();
    expect(local.read()).toBeNull();
  });

  it("rejects missing, malformed, and incompatible snapshots", () => {
    expect(parseSnapshot(null)).toBeNull();
    expect(parseSnapshot("not-json")).toBeNull();
    expect(parseSnapshot(JSON.stringify({ version: 2 }))).toBeNull();
    expect(parseSnapshot(JSON.stringify({
      version: 1,
      challengeCode: "DC-20261123-0318f724",
      difficulty: "extreme",
      events: [],
    }))).toBeNull();
  });
});
