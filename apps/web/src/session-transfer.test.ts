import { describe, expect, it } from "vitest";
import { createSession } from "./game-controller";
import { exportSession, importSession } from "./session-transfer";

describe("session transfer", () => {
  it("exports a versioned session and restores its challenge state", () => {
    const session = createSession(new Date("2026-11-26T00:00:00.000Z"), "hard");
    const restored = importSession(exportSession(session));
    expect(restored?.challenge.details.code).toBe(session.challenge.details.code);
    expect(restored?.difficulty).toBe("hard");
    expect(restored?.events).toEqual(session.events);
  });

  it("rejects malformed, unsupported, and invalid exports", () => {
    expect(importSession("not-json")).toBeNull();
    expect(importSession(JSON.stringify({ format: "other", version: 1 }))).toBeNull();
    expect(importSession(JSON.stringify({ format: "battleship-v2-session", version: 2 }))).toBeNull();
    expect(importSession(JSON.stringify({ format: "battleship-v2-session", version: 1, snapshot: { version: 1, challengeCode: "bad", difficulty: "hard", events: [] } }))).toBeNull();
  });
});
