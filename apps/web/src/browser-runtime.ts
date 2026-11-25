import {
  createMemorySessionStore,
  createResilientSessionStore,
  restoreSession,
  type SessionStore,
  type StorageLike,
} from "./session-persistence";
import { createSession, type GameSession } from "./game-controller";

export interface BrowserRuntime {
  readonly sessionStore: SessionStore;
  readonly initialSession: GameSession;
}

export function createBrowserSessionStore(
  getStorage: () => StorageLike,
): SessionStore {
  try {
    return createResilientSessionStore(getStorage());
  } catch {
    return createMemorySessionStore();
  }
}

export function createBrowserRuntime(
  getStorage: () => StorageLike,
  now: Date = new Date(),
): BrowserRuntime {
  const sessionStore = createBrowserSessionStore(getStorage);
  const savedSnapshot = sessionStore.read();

  return {
    sessionStore,
    initialSession: savedSnapshot
      ? restoreSession(savedSnapshot) ?? createSession(now)
      : createSession(now),
  };
}
