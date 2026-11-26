import { describe, expect, it } from "vitest";
import type { StorageLike } from "./session-persistence";
import { createResultsArchive, recordCompletedResult } from "./results-history";
import { createLocalResultsStore, createResilientResultsStore } from "./results-storage";
import type { CompletedGameResult } from "./game-results";

const savedResult: CompletedGameResult = {
  challengeCode: "DC-20261123-0418f8b7",
  challengeDate: "2026-11-23",
  difficulty: "normal",
  outcome: "won",
  guesses: 6,
  accuracy: 1,
  completedAt: "2026-11-23T07:02:30.000Z",
};

function storage(initial: string | null = null): StorageLike {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
    removeItem: () => { value = null; },
  };
}

describe("results storage", () => {
  it("round-trips archives through browser-like storage", () => {
    const browserStorage = storage();
    const store = createLocalResultsStore(browserStorage);
    const archive = recordCompletedResult(createResultsArchive(), savedResult);

    store.write(archive);

    expect(store.read()).toEqual(archive);
  });

  it("recovers from malformed stored data with an empty archive", () => {
    const store = createLocalResultsStore(storage("not-json"));

    expect(store.read()).toEqual(createResultsArchive());
  });

  it("keeps results available when browser storage throws", () => {
    const failing: StorageLike = {
      getItem: () => { throw new Error("Denied"); },
      setItem: () => { throw new Error("Quota exceeded"); },
      removeItem: () => { throw new Error("Denied"); },
    };
    const store = createResilientResultsStore(failing);
    const archive = recordCompletedResult(createResultsArchive(), savedResult);

    store.write(archive);

    expect(store.read()).toEqual(archive);
    expect(() => store.clear()).not.toThrow();
    expect(store.read()).toEqual(createResultsArchive());
  });
});
