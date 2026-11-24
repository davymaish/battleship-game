import { describe, expect, it } from "vitest";
import { cellAriaLabel, cellDataState } from "./ui-accessibility";

describe("accessibility presentation", () => {
  it("describes available and selected cells clearly", () => {
    expect(cellAriaLabel(0, 0, false)).toBe("Row 1, column 1, available");
    expect(cellAriaLabel(2, 4, true)).toBe("Row 3, column 5, selected");
  });

  it("prioritizes selected state over terminal state", () => {
    expect(cellDataState(false, false)).toBe("available");
    expect(cellDataState(false, true)).toBe("terminal");
    expect(cellDataState(true, true)).toBe("selected");
  });
});
