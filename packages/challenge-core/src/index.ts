export interface ChallengeDetails {
  readonly date: string;
  readonly seed: number;
  readonly label: string;
  readonly code: string;
  readonly replayDate: string;
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function dateKey(date: Date = new Date()): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function isDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && dateKey(date) === value;
}

export function seedForDate(value: string): number {
  if (!isDateKey(value)) {
    throw new Error("Challenge seed requires a valid UTC date key.");
  }

  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createCode(value: string): string | null {
  if (!isDateKey(value)) {
    return null;
  }

  const seed = seedForDate(value).toString(16).padStart(8, "0");
  return `DC-${value.replaceAll("-", "")}-${seed}`;
}

export function describeDate(value: string): ChallengeDetails | null {
  const code = createCode(value);
  if (!code) {
    return null;
  }

  return {
    date: value,
    seed: seedForDate(value),
    label: `Daily challenge — ${value}`,
    code,
    replayDate: value,
  };
}

export function describe(date: Date = new Date()): ChallengeDetails | null {
  return describeDate(dateKey(date));
}

export function parseCode(value: string): ChallengeDetails | null {
  const match = /^DC-(\d{8})-([0-9A-F]{8})$/i.exec(value);
  if (!match) {
    return null;
  }

  const digits = match[1];
  if (!digits) {
    return null;
  }
  const date = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  const details = describeDate(date);
  return details && details.code.toUpperCase() === value.toUpperCase() ? details : null;
}
