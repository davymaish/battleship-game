import type { DailyChallengeSummary } from "./daily-summary";

export function formatDailyChallengeSummary(summary: DailyChallengeSummary): string {
  if (summary.games === 0) return "No completed daily challenges yet.";
  const average = summary.averageGuesses === null ? "—" : summary.averageGuesses.toFixed(1);
  return `${summary.games} games · ${summary.wins} wins · ${Math.round(summary.winRate * 100)}% win rate · ${average} average guesses`;
}

export function renderDailyChallengeSummaryPanel(summary: DailyChallengeSummary): HTMLElement {
  const section = document.createElement("section");
  section.className = "daily-summary-panel";
  section.setAttribute("aria-labelledby", "daily-summary-heading");

  const heading = document.createElement("h2");
  heading.id = "daily-summary-heading";
  heading.textContent = "Daily challenge summary";
  section.appendChild(heading);

  const content = document.createElement("p");
  content.textContent = formatDailyChallengeSummary(summary);
  section.appendChild(content);
  return section;
}
