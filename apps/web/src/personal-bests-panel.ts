import type { CompletedGameResult } from "./game-results";
import { formatCompletedResult } from "./results-panel";
import type { PersonalBests } from "./personal-bests";

export function formatPersonalBest(label: string, result: CompletedGameResult | null): string {
  return result ? `${label}: ${formatCompletedResult(result)}` : `${label}: No victories yet`;
}

export function renderPersonalBestsPanel(bests: PersonalBests): HTMLElement {
  const section = document.createElement("section");
  section.className = "personal-bests-panel";
  section.setAttribute("aria-labelledby", "personal-bests-heading");

  const heading = document.createElement("h2");
  heading.id = "personal-bests-heading";
  heading.textContent = "Personal bests";
  section.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "personal-bests-list";
  for (const [label, result] of [
    ["Fewest guesses", bests.fewestGuesses],
    ["Highest accuracy", bests.highestAccuracy],
    ["Hardest victory", bests.hardestWin],
  ] as const) {
    const item = document.createElement("li");
    item.textContent = formatPersonalBest(label, result);
    list.appendChild(item);
  }
  section.appendChild(list);
  return section;
}
