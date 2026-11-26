import type { CompletedGameResult } from "./game-results";
import { formatCompletedResult } from "./results-panel";

export type ShareOutcome = "shared" | "copied" | "unavailable";

export interface ShareEnvironment {
  readonly share?: (data: { title: string; text: string }) => Promise<void>;
  readonly clipboard?: { writeText(text: string): Promise<void> };
}

export function formatShareSummary(result: CompletedGameResult): string {
  return `${formatCompletedResult(result)} · ${result.challengeDate} · ${result.challengeCode}`;
}

export async function shareCompletedResult(
  result: CompletedGameResult,
  environment: ShareEnvironment = typeof navigator === "undefined" ? {} : navigator,
): Promise<ShareOutcome> {
  const text = formatShareSummary(result);
  if (environment.share) {
    try {
      await environment.share({ title: "Battleship result", text });
      return "shared";
    } catch {
      // Fall through to clipboard when sharing is cancelled or unavailable.
    }
  }
  if (environment.clipboard) {
    try {
      await environment.clipboard.writeText(text);
      return "copied";
    } catch {
      // Report unavailable when the browser denies clipboard access.
    }
  }
  return "unavailable";
}
