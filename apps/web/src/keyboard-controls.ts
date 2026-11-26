import type { Coordinate } from "@battleship/game-core";

export type NavigationKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export function moveCoordinate(
  coordinate: Coordinate,
  key: string,
  boardSize: number,
): Coordinate | null {
  if (!Number.isInteger(boardSize) || boardSize < 1) return null;
  const next = { ...coordinate };
  if (key === "ArrowUp") next.row -= 1;
  else if (key === "ArrowDown") next.row += 1;
  else if (key === "ArrowLeft") next.column -= 1;
  else if (key === "ArrowRight") next.column += 1;
  else return null;
  return {
    row: Math.max(0, Math.min(boardSize - 1, next.row)),
    column: Math.max(0, Math.min(boardSize - 1, next.column)),
  };
}
