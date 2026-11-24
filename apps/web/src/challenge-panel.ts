import type { Difficulty } from "@battleship/game-core";
import type { GameSession } from "./game-controller";

export interface ChallengePanelActions {
  onDifficulty(value: Difficulty): void;
  onLoad(code: string): void;
}

function isDifficulty(value: string): value is Difficulty {
  return value === "easy" || value === "normal" || value === "hard";
}

export function renderChallengePanel(
  session: GameSession,
  actions: ChallengePanelActions,
): HTMLElement {
  const section = document.createElement("section");
  section.className = "challenge-panel";
  section.setAttribute("aria-labelledby", "challenge-heading");

  const heading = document.createElement("h2");
  heading.id = "challenge-heading";
  heading.textContent = "Daily challenge";
  section.appendChild(heading);

  const label = document.createElement("p");
  label.textContent = `${session.challenge.details.label} · Seed ${session.challenge.details.seed}`;
  section.appendChild(label);

  const code = document.createElement("code");
  code.textContent = session.challenge.details.code;
  section.appendChild(code);

  const difficultyLabel = document.createElement("label");
  difficultyLabel.textContent = "Difficulty";
  difficultyLabel.htmlFor = "difficulty";
  section.appendChild(difficultyLabel);

  const difficulty = document.createElement("select");
  difficulty.id = "difficulty";
  difficulty.name = "difficulty";
  difficulty.setAttribute("aria-label", "Difficulty");
  for (const optionValue of ["easy", "normal", "hard"] as const) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
    option.selected = session.difficulty === optionValue;
    difficulty.appendChild(option);
  }
  difficulty.addEventListener("change", () => {
    if (isDifficulty(difficulty.value)) {
      actions.onDifficulty(difficulty.value);
    }
  });
  section.appendChild(difficulty);

  const form = document.createElement("form");
  form.className = "challenge-form";
  form.setAttribute("aria-label", "Load replay challenge");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.elements.namedItem("challenge-code");
    if (input instanceof HTMLInputElement) {
      actions.onLoad(input.value);
    }
  });

  const input = document.createElement("input");
  input.id = "challenge-code";
  input.name = "challenge-code";
  input.type = "text";
  input.value = session.challenge.input;
  input.placeholder = "DC-YYYYMMDD-XXXXXXXX";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("aria-label", "Challenge code");
  form.appendChild(input);

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Load replay";
  form.appendChild(button);
  section.appendChild(form);

  if (session.challenge.error) {
    const error = document.createElement("p");
    error.id = "challenge-code-error";
    error.className = "challenge-error";
    error.textContent = session.challenge.error;
    error.setAttribute("role", "alert");
    input.setAttribute("aria-describedby", error.id);
    section.appendChild(error);
  }

  return section;
}
