import { describe, expect, it } from "vitest";
import { createBrowserRuntime, createBrowserSessionStore } from "./browser-runtime";
import { snapshotFromSession, type SessionSnapshot } from "./session-persistence";
import { createSession } from "./game-controller";
import type { StorageLike } from "./session-persistence";

const now = new Date("2026-11-23T07:00:00Z");

function storage(): StorageLike {
  let value: string | null = null;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
    removeItem: () => { value = null; },
  };
}

describe("browser runtime", () => {
  it("uses the supplied browser storage when available", () => {
    const store = createBrowserSessionStore(storage);
    const snapshot = snapshotFromSession(createSession(now));

    store.write(snapshot);
    expect(store.read()).toEqual(snapshot);
  });

  it("restores a valid saved snapshot at startup", () => {
    const saved = snapshotFromSession(createSession(now));
    const backing = storage();
    backing.setItem("battleship-v2/session", JSON.stringify(saved));

    const runtime = createBrowserRuntime(() => backing, now);

    expect(runtime.initialSession.challenge.details.code).toBe(saved.challengeCode);
    expect(runtime.initialSession.message).toBe("Restored saved session.");
  });

  it("starts a fresh session when the saved snapshot is invalid", () => {
    const backing = storage();
    const invalid: Partial<SessionSnapshot> = {
      version: 1,
      challengeCode: "not-a-challenge",
      difficulty: "normal",
      events: [],
    };
    backing.setItem("battleship-v2/session", JSON.stringify(invalid));

    const runtime = createBrowserRuntime(() => backing, now);

    expect(runtime.initialSession.message).toBe("Choose a coordinate to fire.");
    expect(runtime.initialSession.challenge.details.code).not.toBe("not-a-challenge");
  });

  it("falls back to memory when storage access throws", () => {
    const snapshot = snapshotFromSession(createSession(now));
    const store = createBrowserSessionStore(() => {
      throw new Error("Storage access denied");
    });

    expect(() => store.write(snapshot)).not.toThrow();
    expect(store.read()).toEqual(snapshot);
  });

  it("falls back to memory when writes fail after initialization", () => {
    const snapshot = snapshotFromSession(createSession(now));
    const failing: StorageLike = {
      getItem: () => null,
      setItem: () => { throw new Error("Quota exceeded"); },
      removeItem: () => { throw new Error("Storage unavailable"); },
    };
    const store = createBrowserSessionStore(() => failing);

    store.write(snapshot);
    expect(store.read()).toEqual(snapshot);
  });
});
