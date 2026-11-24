import type { Coordinate } from "@battleship/game-core";
import type { GameSession } from "./game-controller";
import { cellAriaLabel, cellDataState } from "./ui-accessibility";

export function renderBoard(
  session: GameSession,
  onFire: (coordinate: Coordinate) => void,
): HTMLElement {
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
      const selected = session.game.shots.has(`${row}:${column}`);
      const terminal = session.game.phase === "won" || session.game.phase === "lost";
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-rowindex", String(row + 1));
      button.setAttribute("aria-colindex", String(column + 1));
      button.setAttribute("aria-label", cellAriaLabel(row, column, selected));
      button.setAttribute("aria-pressed", String(selected));
      button.dataset.state = cellDataState(selected, terminal);
      button.textContent = selected ? "•" : "";
      button.disabled = terminal || selected;
      button.addEventListener("click", () => onFire(coordinate));
      board.appendChild(button);
    }
  }

  return board;
}
