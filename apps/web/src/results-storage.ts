import type { StorageLike } from "./session-persistence";
import {
  createResultsArchive,
  parseResultsArchive,
  type ResultsArchive,
} from "./results-history";

export interface ResultsArchiveStore {
  read(): ResultsArchive;
  write(archive: ResultsArchive): void;
  clear(): void;
}

export function createLocalResultsStore(
  storage: StorageLike,
  key = "battleship-v2/results",
): ResultsArchiveStore {
  return {
    read: () => parseResultsArchive(storage.getItem(key)) ?? createResultsArchive(),
    write: (archive) => storage.setItem(key, JSON.stringify(archive)),
    clear: () => storage.removeItem(key),
  };
}

function createMemoryResultsStore(): ResultsArchiveStore {
  let archive = createResultsArchive();
  return {
    read: () => archive,
    write: (next) => { archive = next; },
    clear: () => { archive = createResultsArchive(); },
  };
}

export function createResilientResultsStore(storage: StorageLike): ResultsArchiveStore {
  const primary = createLocalResultsStore(storage);
  const fallback = createMemoryResultsStore();

  return {
    read: () => {
      try {
        const archive = primary.read();
        fallback.write(archive);
        return archive;
      } catch {
        return fallback.read();
      }
    },
    write: (archive) => {
      fallback.write(archive);
      try {
        primary.write(archive);
      } catch {
        // Memory fallback remains available for the current session.
      }
    },
    clear: () => {
      fallback.clear();
      try {
        primary.clear();
      } catch {
        // A failing browser store must not block clearing results.
      }
    },
  };
}

export function createMemoryResultsArchiveStore(): ResultsArchiveStore {
  return createMemoryResultsStore();
}
