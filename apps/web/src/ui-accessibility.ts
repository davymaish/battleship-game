export function cellAriaLabel(
  row: number,
  column: number,
  selected: boolean,
): string {
  return `Row ${row + 1}, column ${column + 1}${selected ? ", selected" : ", available"}`;
}

export function cellDataState(selected: boolean, terminal: boolean): "selected" | "terminal" | "available" {
  if (selected) {
    return "selected";
  }
  return terminal ? "terminal" : "available";
}
