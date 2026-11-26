import type { CompletedGameResult } from "./game-results";
import type { ResultsArchive } from "./results-history";
import type { ShareOutcome } from "./result-sharing";

export function formatCompletedResult(result: CompletedGameResult): string {
  const outcome = result.outcome === "won" ? "Victory" : "Loss";
  return `${outcome} · ${result.difficulty} · ${result.guesses} guesses · ${Math.round(result.accuracy * 100)}% accuracy`;
}

export function renderResultsPanel(
  archive: ResultsArchive,
  onShare?: (result: CompletedGameResult) => Promise<ShareOutcome>,
): HTMLElement {
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
    if (onShare) {
      const shareButton = document.createElement("button");
      shareButton.type = "button";
      shareButton.className = "result-share-button";
      shareButton.textContent = "Share";
      shareButton.setAttribute("aria-label", `Share result from ${result.challengeDate}`);
      shareButton.addEventListener("click", async () => {
        shareButton.disabled = true;
        const outcome = await onShare(result);
        shareButton.textContent = outcome === "shared" ? "Shared" : outcome === "copied" ? "Copied" : "Unavailable";
        if (outcome !== "unavailable") shareButton.disabled = false;
      });
      item.appendChild(shareButton);
    }
    list.appendChild(item);
  }
  section.appendChild(list);
  return section;
}
