import type { WinStreaks } from "./win-streaks";

export function formatWinStreaks(streaks: WinStreaks): string {
  return `Current streak: ${streaks.current} · Longest streak: ${streaks.longest}`;
}

export function renderWinStreaksPanel(streaks: WinStreaks): HTMLElement {
  const section = document.createElement("section");
  section.className = "win-streaks-panel";
  section.setAttribute("aria-labelledby", "win-streaks-heading");

  const heading = document.createElement("h2");
  heading.id = "win-streaks-heading";
  heading.textContent = "Win streaks";
  section.appendChild(heading);

  const summary = document.createElement("p");
  summary.textContent = formatWinStreaks(streaks);
  section.appendChild(summary);
  return section;
}
