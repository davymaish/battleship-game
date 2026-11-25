import {
  createSession,
  fireAt,
  loadChallenge,
  setDifficulty,
  type GameSession,
} from "./game-controller";
import { renderBoard } from "./board";
import { renderChallengePanel } from "./challenge-panel";
import {
  createLocalSessionStore,
  createMemorySessionStore,
  createResilientSessionStore,
  restoreSession,
  snapshotFromSession,
  type SessionStore,
} from "./session-persistence";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  throw new Error("The v2 application root is missing.");
}
const app = appElement;
function createBrowserSessionStore(): SessionStore {
  try {
    return createResilientSessionStore(window.localStorage);
  } catch {
    return createMemorySessionStore();
  }
}

const sessionStore = createBrowserSessionStore();
const savedSnapshot = sessionStore.read();
let session: GameSession = savedSnapshot
  ? restoreSession(savedSnapshot) ?? createSession()
  : createSession();

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
