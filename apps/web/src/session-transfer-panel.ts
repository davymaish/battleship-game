export interface SessionTransferActions {
  exportSession(): string;
  importSession(value: string): boolean;
}

export function renderSessionTransferPanel(actions: SessionTransferActions): HTMLElement {
  const section = document.createElement("section");
  section.className = "session-transfer-panel";
  section.setAttribute("aria-labelledby", "session-transfer-heading");

  const heading = document.createElement("h2");
  heading.id = "session-transfer-heading";
  heading.textContent = "Session backup";
  section.appendChild(heading);

  const help = document.createElement("p");
  help.textContent = "Export the current game as JSON or paste a previous export to restore it.";
  section.appendChild(help);

  const controls = document.createElement("div");
  controls.className = "session-transfer-controls";
  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.textContent = "Export session";
  controls.appendChild(exportButton);

  const textarea = document.createElement("textarea");
  textarea.id = "session-transfer-data";
  textarea.rows = 4;
  textarea.placeholder = "Paste a Battleship v2 session export here";
  textarea.setAttribute("aria-label", "Session export JSON");
  controls.appendChild(textarea);

  const importButton = document.createElement("button");
  importButton.type = "button";
  importButton.textContent = "Import session";
  controls.appendChild(importButton);
  section.appendChild(controls);

  const status = document.createElement("p");
  status.className = "session-transfer-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  section.appendChild(status);

  exportButton.addEventListener("click", () => {
    textarea.value = actions.exportSession();
    status.textContent = "Session exported. Copy the JSON to keep a backup.";
  });
  importButton.addEventListener("click", () => {
    status.textContent = actions.importSession(textarea.value)
      ? "Session imported."
      : "That session export is invalid.";
  });
  return section;
}
