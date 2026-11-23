import { describe, expect, it } from "vitest";
import {
  currentChallenge,
  resolveChallengeCode,
  type ChallengeViewModel,
} from "./challenge-model";

const now = new Date("2026-11-23T07:00:00Z");

function fallback(): ChallengeViewModel {
  return currentChallenge(now);
}

describe("challenge web model", () => {
  it("creates the current UTC challenge for the browser shell", () => {
    const model = currentChallenge(now);

    expect(model.details.date).toBe("2026-11-23");
    expect(model.details.code).toBe("DC-20261123-0318f724");
    expect(model.error).toBeNull();
  });

  it("loads a valid replay code", () => {
    const model = resolveChallengeCode("DC-20261122-0418f8b7", fallback());

    expect(model.details.date).toBe("2026-11-22");
    expect(model.error).toBeNull();
  });

  it("keeps the current challenge and reports invalid input", () => {
    const model = resolveChallengeCode("not-a-code", fallback());

    expect(model.details.date).toBe("2026-11-23");
    expect(model.error).toBe("That challenge code is not valid.");
  });
});
