import { describe, expect, it } from "vitest";
import { describeDate } from "@battleship/challenge-core";
import { createGameForChallenge } from "./game-session";

describe("challenge game session", () => {
  it("creates the same fleet for the same challenge", () => {
    const challenge = describeDate("2026-11-23");
    expect(challenge).not.toBeNull();

    if (!challenge) {
      throw new Error("Expected a valid challenge fixture.");
    }

    const first = createGameForChallenge(challenge);
    const second = createGameForChallenge(challenge);

    expect(first.config.difficulty).toBe("normal");
    expect(first.phase).toBe("setup");
    expect(first.ships).toEqual(second.ships);
  });

  it("changes the fleet when the challenge date changes", () => {
    const firstChallenge = describeDate("2026-11-23");
    const secondChallenge = describeDate("2026-11-22");

    expect(firstChallenge).not.toBeNull();
    expect(secondChallenge).not.toBeNull();
    if (!firstChallenge || !secondChallenge) {
      throw new Error("Expected valid challenge fixtures.");
    }

    expect(createGameForChallenge(firstChallenge).ships)
      .not.toEqual(createGameForChallenge(secondChallenge).ships);
  });
});
