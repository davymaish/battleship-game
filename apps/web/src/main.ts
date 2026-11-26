import {
  type GameSession,
} from "./game-controller";
import { renderBoard } from "./board";
import { renderChallengePanel } from "./challenge-panel";
import { snapshotFromSession } from "./session-persistence";
import { createBrowserRuntime } from "./browser-runtime";
import { createSessionInteractions } from "./session-interactions";
import { extractCompletedResult } from "./game-results";
import { recordCompletedResult } from "./results-history";
import { createResilientResultsStore } from "./results-storage";
import { renderResultsPanel } from "./results-panel";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  throw new Error("The v2 application root is missing.");
}
const app = appElement;
const runtime = createBrowserRuntime(() => window.localStorage);
const sessionStore = runtime.sessionStore;
const resultsStore = createResilientResultsStore(window.localStorage);
let resultsArchive = resultsStore.read();
let session: GameSession = runtime.initialSession;
function persistSession(): void {
  sessionStore.write(snapshotFromSession(session));
}
const interactions = createSessionInteractions(session, (next) => {
  const wasTerminal = session.game.phase === "won" || session.game.phase === "lost";
  session = next;
  const isTerminal = session.game.phase === "won" || session.game.phase === "lost";
  if (!wasTerminal && isTerminal) {
    const result = extractCompletedResult(session, new Date());
    if (result) {
      resultsArchive = recordCompletedResult(resultsArchive, result);
      resultsStore.write(resultsArchive);
    }
  }
  persistSession();
  render();
});
function render(): void {
  app.innerHTML = "";

  const heading = document.createElement("h1");
  heading.textContent = "Battleship v2";
  app.appendChild(heading);
  app.appendChild(renderChallengePanel(session, {
    onDifficulty: (difficulty) => {
      interactions.changeDifficulty(difficulty);
    },
    onLoad: (code) => {
      interactions.loadReplay(code);
    },
  }));

  const status = document.createElement("p");
  status.textContent = session.message;
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  app.appendChild(status);

  app.appendChild(renderResultsPanel(resultsArchive));

  app.appendChild(renderBoard(session, (coordinate) => {
    interactions.fire(coordinate);
  }));
}

persistSession();
render();
