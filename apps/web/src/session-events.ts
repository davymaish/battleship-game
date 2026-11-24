import type {
  Coordinate,
  Difficulty,
  GamePhase,
  ShotOutcome,
} from "@battleship/game-core";

export interface ChallengeSessionEvent {
  readonly type: "challenge-started" | "challenge-loaded";
  readonly code: string;
  readonly difficulty: Difficulty;
}

export interface DifficultyChangedEvent {
  readonly type: "difficulty-changed";
  readonly difficulty: Difficulty;
}

export interface ShotFiredEvent {
  readonly type: "shot-fired";
  readonly coordinate: Coordinate;
  readonly outcome: ShotOutcome;
  readonly phase: GamePhase;
}

export type SessionEvent =
  | ChallengeSessionEvent
  | DifficultyChangedEvent
  | ShotFiredEvent;
