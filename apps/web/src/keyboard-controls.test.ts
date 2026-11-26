import { describe, expect, it } from "vitest";
import { moveCoordinate } from "./keyboard-controls";

describe("moveCoordinate", () => {
  it("moves to adjacent cells", () => {
    expect(moveCoordinate({ row: 2, column: 2 }, "ArrowUp", 7)).toEqual({ row: 1, column: 2 });
    expect(moveCoordinate({ row: 2, column: 2 }, "ArrowRight", 7)).toEqual({ row: 2, column: 3 });
  });

  it("stops at board edges", () => {
    expect(moveCoordinate({ row: 0, column: 0 }, "ArrowUp", 7)).toEqual({ row: 0, column: 0 });
    expect(moveCoordinate({ row: 6, column: 6 }, "ArrowRight", 7)).toEqual({ row: 6, column: 6 });
  });

  it("ignores non-arrow keys and invalid board sizes", () => {
    expect(moveCoordinate({ row: 2, column: 2 }, "Enter", 7)).toBeNull();
    expect(moveCoordinate({ row: 0, column: 0 }, "ArrowDown", 0)).toBeNull();
  });
});
