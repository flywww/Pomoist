import { createContext } from "react";
import { Settings } from "../utils/db";

export type PomodoroMode = "focus" | "shortBreak" | "longBreak";
export type PomodoroAction = 
  { type: "START_TIMER"} |
  { type: "PAUSE_TIMER"} | 
  { type: "RESET_TIMER", defaultSettings: Settings} | 
  { type: "TICK"} | 
  { type: "COMPLETE_SESSION", defaultSettings: Settings};
export interface PomodoroState {
  mode: PomodoroMode;
  time: number;
  isActive: boolean;
  sessionCompleted: number;
}

export interface PomodoroContextType extends PomodoroState {
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
  }

export const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

