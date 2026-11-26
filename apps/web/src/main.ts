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
import { createBrowserResultsStore } from "./results-storage";
import { renderResultsPanel } from "./results-panel";
import { achievementDefinitions, unlockedAchievements } from "./achievements";
import { renderAchievementsPanel } from "./achievements-panel";
import { calculatePersonalBests } from "./personal-bests";
import { renderPersonalBestsPanel } from "./personal-bests-panel";
import { calculateWinStreaks } from "./win-streaks";
import { renderWinStreaksPanel } from "./win-streaks-panel";
import { calculateDailyChallengeSummary } from "./daily-summary";
import { renderDailyChallengeSummaryPanel } from "./daily-summary-panel";
import { shareCompletedResult } from "./result-sharing";
import "./style.css";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  throw new Error("The v2 application root is missing.");
}
const app = appElement;
const runtime = createBrowserRuntime(() => window.localStorage);
const sessionStore = runtime.sessionStore;
const resultsStore = createBrowserResultsStore(() => window.localStorage);
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

  app.appendChild(renderResultsPanel(resultsArchive, (result) => shareCompletedResult(result)));
  app.appendChild(renderPersonalBestsPanel(calculatePersonalBests(resultsArchive.results)));
  app.appendChild(renderWinStreaksPanel(calculateWinStreaks(resultsArchive.results)));
  app.appendChild(renderDailyChallengeSummaryPanel(calculateDailyChallengeSummary(resultsArchive.results)));
  const unlockedIds = new Set(unlockedAchievements(resultsArchive.results).map((achievement) => achievement.id));
  app.appendChild(renderAchievementsPanel(achievementDefinitions(), unlockedIds));

  app.appendChild(renderBoard(session, (coordinate) => {
    interactions.fire(coordinate);
  }));
}

persistSession();
render();
