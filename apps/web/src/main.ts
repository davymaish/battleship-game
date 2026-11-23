import {
  createGame,
  fire,
  type Coordinate,
  type GameState,
  type Ship,
} from "@battleship/game-core";
import "./style.css";

const ships: Ship[] = [
  { id: "alpha", cells: [{ row: 1, column: 1 }, { row: 1, column: 2 }, { row: 1, column: 3 }] },
  { id: "beta", cells: [{ row: 4, column: 4 }, { row: 4, column: 5 }, { row: 4, column: 6 }] },
];

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  throw new Error("The v2 application root is missing.");
}
const app = appElement;

let state: GameState = createGame(ships);
let message = "Choose a coordinate to fire.";

function render(): void {
  app.innerHTML = "";

  const heading = document.createElement("h1");
  heading.textContent = "Battleship v2";
  app.appendChild(heading);

  const status = document.createElement("p");
  status.textContent = message;
  status.setAttribute("role", "status");
  app.appendChild(status);

  const board = document.createElement("div");
  board.className = "board";
  board.setAttribute("role", "grid");
  board.setAttribute("aria-label", "Battleship board");

  for (let row = 0; row < state.config.boardSize; row += 1) {
    for (let column = 0; column < state.config.boardSize; column += 1) {
      const coordinate: Coordinate = { row, column };
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.textContent = state.shots.has(`${row}:${column}`) ? "•" : "";
      button.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}`);
      button.disabled = state.phase === "won" || state.shots.has(`${row}:${column}`);
      button.addEventListener("click", () => {
        const turn = fire(state, coordinate);
        state = turn.state;
        message = turn.result.outcome === "blocked"
          ? "The game is over."
          : turn.result.outcome === "hit"
          ? turn.result.sunkShipId
            ? `You sank ${turn.result.sunkShipId}.`
            : "Hit!"
          : "Miss.";
        if (turn.result.phase === "won") {
          message = "You won!";
        }
        render();
      });
      board.appendChild(button);
    }
  }

  app.appendChild(board);
}

render();
