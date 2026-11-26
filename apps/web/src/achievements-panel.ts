import type { Achievement } from "./achievements";

export function formatAchievementStatus(achievement: Achievement, unlocked: boolean): string {
  return `${unlocked ? "Unlocked" : "Locked"}: ${achievement.title} — ${achievement.description}`;
}

export function renderAchievementsPanel(
  definitions: readonly Achievement[],
  unlockedIds: ReadonlySet<Achievement["id"]>,
): HTMLElement {
  const section = document.createElement("section");
  section.className = "achievements-panel";
  section.setAttribute("aria-labelledby", "achievements-heading");

  const heading = document.createElement("h2");
  heading.id = "achievements-heading";
  heading.textContent = "Achievements";
  section.appendChild(heading);

  const list = document.createElement("ul");
  list.className = "achievements-list";
  for (const achievement of definitions) {
    const item = document.createElement("li");
    const unlocked = unlockedIds.has(achievement.id);
    item.dataset.status = unlocked ? "unlocked" : "locked";
    item.textContent = formatAchievementStatus(achievement, unlocked);
    list.appendChild(item);
  }
  section.appendChild(list);
  return section;
}
