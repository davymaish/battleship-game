import type { CompletedGameResult } from "./game-results";
import type { ResultsArchive } from "./results-history";

export function formatCompletedResult(result: CompletedGameResult): string {
  const outcome = result.outcome === "won" ? "Victory" : "Loss";
  return `${outcome} · ${result.difficulty} · ${result.guesses} guesses · ${Math.round(result.accuracy * 100)}% accuracy`;
}

export function renderResultsPanel(archive: ResultsArchive): HTMLElement {
  const section = document.createElement("section");
  section.className = "results-panel";
  section.setAttribute("aria-labelledby", "results-heading");

  const heading = document.createElement("h2");
  heading.id = "results-heading";
  heading.textContent = "Recent results";
  section.appendChild(heading);

  if (archive.results.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Completed games will appear here.";
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement("ol");
  list.className = "results-list";
  for (const result of archive.results) {
    const item = document.createElement("li");
    const summary = document.createElement("strong");
    summary.textContent = formatCompletedResult(result);
    item.appendChild(summary);

    const details = document.createElement("span");
    details.textContent = ` · ${result.challengeDate} · ${result.challengeCode}`;
    item.appendChild(details);
    list.appendChild(item);
  }
  section.appendChild(list);
  return section;
}
