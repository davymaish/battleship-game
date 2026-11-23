import {
  describe,
  parseCode,
  type ChallengeDetails,
} from "@battleship/challenge-core";

export interface ChallengeViewModel {
  readonly details: ChallengeDetails;
  readonly input: string;
  readonly error: string | null;
}

export function currentChallenge(now: Date = new Date()): ChallengeViewModel {
  const details = describe(now);
  if (!details) {
    throw new Error("Unable to create the current daily challenge.");
  }

  return { details, input: details.code, error: null };
}

export function resolveChallengeCode(
  input: string,
  fallback: ChallengeViewModel,
): ChallengeViewModel {
  const normalized = input.trim();
  if (!normalized) {
    return { ...fallback, input, error: "Enter a daily challenge code." };
  }

  const details = parseCode(normalized);
  if (!details) {
    return { ...fallback, input, error: "That challenge code is not valid." };
  }

  return { details, input: normalized, error: null };
}
