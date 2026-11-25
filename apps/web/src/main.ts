import {
  fireAt,
  loadChallenge,
  setDifficulty,
  type GameSession,
} from "./game-controller";
import { renderBoard } from "./board";
import { renderChallengePanel } from "./challenge-panel";
import { snapshotFromSession } from "./session-persistence";
import { createBrowserRuntime } from "./browser-runtime";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  throw new Error("The v2 application root is missing.");
}
const app = appElement;
const runtime = createBrowserRuntime(() => window.localStorage);
const sessionStore = runtime.sessionStore;
let session: GameSession = runtime.initialSession;

function persistSession(): void {
  sessionStore.write(snapshotFromSession(session));
}

function render(): void {
  app.innerHTML = "";

  const heading = document.createElement("h1");
  heading.textContent = "Battleship v2";
  app.appendChild(heading);
  app.appendChild(renderChallengePanel(session, {
    onDifficulty: (difficulty) => {
      session = setDifficulty(session, difficulty);
      persistSession();
      render();
    },
    onLoad: (code) => {
      session = loadChallenge(session, code);
      persistSession();
      render();
    },
  }));

  const status = document.createElement("p");
  status.textContent = session.message;
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  app.appendChild(status);

  app.appendChild(renderBoard(session, (coordinate) => {
    session = fireAt(session, coordinate);
    persistSession();
    render();
  }));
}

persistSession();
render();
