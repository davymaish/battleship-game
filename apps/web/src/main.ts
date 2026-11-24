import {
  type Coordinate,
  type Difficulty,
} from "@battleship/game-core";
import {
  createSession,
  fireAt,
  loadChallenge,
  setDifficulty,
  type GameSession,
} from "./game-controller";
import {
  createLocalSessionStore,
  restoreSession,
  snapshotFromSession,
} from "./session-persistence";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  throw new Error("The v2 application root is missing.");
}
const app = appElement;
const sessionStore = createLocalSessionStore(window.localStorage);
const savedSnapshot = sessionStore.read();
let session: GameSession = savedSnapshot
  ? restoreSession(savedSnapshot) ?? createSession()
  : createSession();

function persistSession(): void {
  sessionStore.write(snapshotFromSession(session));
}

persistSession();

function isDifficulty(value: string): value is Difficulty {
  return value === "easy" || value === "normal" || value === "hard";
}

function renderChallenge(): HTMLElement {
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
      session = setDifficulty(session, difficulty.value);
      persistSession();
      render();
    }
  });
  section.appendChild(difficulty);

  const form = document.createElement("form");
  form.className = "challenge-form";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.elements.namedItem("challenge-code");
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    session = loadChallenge(session, input.value);
    persistSession();
    render();
  });

  const input = document.createElement("input");
  input.name = "challenge-code";
  input.type = "text";
  input.value = session.challenge.input;
  input.placeholder = "DC-YYYYMMDD-XXXXXXXX";
  input.setAttribute("aria-label", "Challenge code");
  form.appendChild(input);

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Load replay";
  form.appendChild(button);
  section.appendChild(form);

  if (session.challenge.error) {
    const error = document.createElement("p");
    error.className = "challenge-error";
    error.textContent = session.challenge.error;
    error.setAttribute("role", "alert");
    section.appendChild(error);
  }

  return section;
}

function render(): void {
  app.innerHTML = "";

  const heading = document.createElement("h1");
  heading.textContent = "Battleship v2";
  app.appendChild(heading);
  app.appendChild(renderChallenge());

  const status = document.createElement("p");
  status.textContent = session.message;
  status.setAttribute("role", "status");
  app.appendChild(status);

  const board = document.createElement("div");
  board.className = "board";
  board.setAttribute("role", "grid");
  board.setAttribute("aria-label", "Battleship board");

  for (let row = 0; row < session.game.config.boardSize; row += 1) {
    for (let column = 0; column < session.game.config.boardSize; column += 1) {
      const coordinate: Coordinate = { row, column };
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.textContent = session.game.shots.has(`${row}:${column}`) ? "•" : "";
      button.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}`);
      button.disabled = session.game.phase === "won" || session.game.shots.has(`${row}:${column}`);
      button.addEventListener("click", () => {
        session = fireAt(session, coordinate);
        persistSession();
        render();
      });
      board.appendChild(button);
    }
  }

  app.appendChild(board);
}

render();
