import type { Coordinate } from "@battleship/game-core";
import type { GameSession } from "./game-controller";

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
      button.textContent = session.game.shots.has(`${row}:${column}`) ? "•" : "";
      button.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}`);
      button.disabled = session.game.phase === "won" || session.game.shots.has(`${row}:${column}`);
      button.addEventListener("click", () => onFire(coordinate));
      board.appendChild(button);
    }
  }

  return board;
}
