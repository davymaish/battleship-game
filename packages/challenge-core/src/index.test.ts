import { describe as testGroup, expect, it } from "vitest";
import {
  createCode,
  dateKey,
  describe as describeChallenge,
  describeDate,
  isDateKey,
  parseCode,
  seedForDate,
} from "./index";

testGroup("challenge-core", () => {
  it("formats UTC dates independently of local time", () => {
    const date = new Date("2024-09-07T23:30:00-05:00");
    expect(dateKey(date)).toBe("2024-09-08");
    expect(describeChallenge(date)?.date).toBe("2024-09-08");
  });

  it("generates stable date seeds and replay details", () => {
    const details = describeDate("2024-11-30");
    expect(details).not.toBeNull();
    expect(details?.seed).toBe(seedForDate("2024-11-30"));
    expect(details?.label).toBe("Daily challenge — 2024-11-30");
    expect(details?.replayDate).toBe("2024-11-30");
  });

  it("round-trips compact challenge codes", () => {
    const code = createCode("2024-11-30");
    expect(code).toBe("DC-20241130-" + seedForDate("2024-11-30").toString(16).padStart(8, "0"));
    expect(parseCode(code ?? "")?.date).toBe("2024-11-30");
  });

  it("rejects invalid dates and tampered codes", () => {
    expect(isDateKey("2024-02-30")).toBe(false);
    expect(describeDate("2024-02-30")).toBeNull();
    expect(parseCode("DC-20241130-00000000")).toBeNull();
    expect(parseCode("2024-11-30")).toBeNull();
  });
});
