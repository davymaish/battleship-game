import type { ChallengeHistoryEntry } from "./challenge-history";

export interface ChallengeHistoryActions {
  onReplay(code: string): void;
}

export function formatChallengeHistoryEntry(entry: ChallengeHistoryEntry): string {
  return `${entry.date} · ${entry.code}`;
}

export function renderChallengeHistoryPanel(
  history: readonly ChallengeHistoryEntry[],
  actions: ChallengeHistoryActions,
): HTMLElement {
  const section = document.createElement("section");
  section.className = "challenge-history-panel";
  section.setAttribute("aria-labelledby", "challenge-history-heading");

  const heading = document.createElement("h2");
  heading.id = "challenge-history-heading";
  heading.textContent = "Recent challenges";
  section.appendChild(heading);

  if (history.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Played challenge codes will appear here.";
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement("ol");
  list.className = "challenge-history-list";
  for (const entry of history) {
    const item = document.createElement("li");
    const code = document.createElement("code");
    code.textContent = formatChallengeHistoryEntry(entry);
    item.appendChild(code);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Replay";
    button.setAttribute("aria-label", `Replay challenge from ${entry.date}`);
    button.addEventListener("click", () => actions.onReplay(entry.code));
    item.appendChild(button);
    list.appendChild(item);
  }
  section.appendChild(list);
  return section;
}
