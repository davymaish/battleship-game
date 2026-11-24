import type { Difficulty } from "@battleship/game-core";
import type { GameSession } from "./game-controller";
import type { SessionEvent } from "./session-events";

export interface SessionSnapshot {
  readonly version: 1;
  readonly challengeCode: string;
  readonly difficulty: Difficulty;
  readonly events: readonly SessionEvent[];
}

export interface SessionStore {
  read(): SessionSnapshot | null;
  write(snapshot: SessionSnapshot): void;
  clear(): void;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function snapshotFromSession(session: GameSession): SessionSnapshot {
  return {
    version: 1,
    challengeCode: session.challenge.details.code,
    difficulty: session.difficulty,
    events: session.events,
  };
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "normal" || value === "hard";
}

function isSessionSnapshot(value: unknown): value is SessionSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return candidate.version === 1
    && typeof candidate.challengeCode === "string"
    && isDifficulty(candidate.difficulty)
    && Array.isArray(candidate.events);
}

export function parseSnapshot(value: string | null): SessionSnapshot | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return isSessionSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function createLocalSessionStore(
  storage: StorageLike,
  key = "battleship-v2/session",
): SessionStore {
  return {
    read: () => parseSnapshot(storage.getItem(key)),
    write: (snapshot) => storage.setItem(key, JSON.stringify(snapshot)),
    clear: () => storage.removeItem(key),
  };
}

export function createMemorySessionStore(): SessionStore {
  let value: SessionSnapshot | null = null;
  return {
    read: () => value,
    write: (snapshot) => { value = snapshot; },
    clear: () => { value = null; },
  };
}
