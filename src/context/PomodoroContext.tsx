import { createContext } from "react";
import { Settings } from "../utils/db";

export type PomodoroMode = "focus" | "shortBreak" | "longBreak";
export type PomodoroAction = 
  { type: "START_TIMER", onGoingTodoId?: number} |
  { type: "PAUSE_TIMER", onGoingTodoId?: number} | 
  { type: "RESET_TIMER", onGoingTodoId?: number,defaultSettings: Settings} | 
  { type: "TICK"} | 
  { type: "COMPLETE_SESSION", defaultSettings: Settings};
export interface PomodoroState {
  mode: PomodoroMode;
  time: number;
  isActive: boolean;
  sessionCompleted: number;
  onGoingTodoId: number | undefined;
}

export interface PomodoroContextType extends PomodoroState {
    startTimer: (onGoingTodoId: number | undefined) => void;
    pauseTimer: () => void;
    resetTimer: () => void;
  }

export const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

