import type { GameSession } from "./game-controller";
import { restoreSession, snapshotFromSession, type SessionSnapshot } from "./session-persistence";

export interface SessionExport {
  readonly format: "battleship-v2-session";
  readonly version: 1;
  readonly snapshot: SessionSnapshot;
}

export function exportSession(session: GameSession): string {
  const payload: SessionExport = {
    format: "battleship-v2-session",
    version: 1,
    snapshot: snapshotFromSession(session),
  };
  return JSON.stringify(payload);
}

export function importSession(value: string): GameSession | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Record<string, unknown>;
    if (candidate.format !== "battleship-v2-session" || candidate.version !== 1) return null;
    if (!candidate.snapshot || typeof candidate.snapshot !== "object") return null;
    return restoreSession(candidate.snapshot as SessionSnapshot);
  } catch {
    return null;
  }
}
