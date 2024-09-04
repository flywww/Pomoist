import { createContext } from "react";
import { PomodoroSession } from "../utils/db";

export interface PomodoroSessionContextType {
    lastSession: PomodoroSession | undefined;
    addSession: (session: PomodoroSession) => Promise<void>;
    getSessions: (filter:{id?: number, todoId?: number}) => Promise<PomodoroSession[] | undefined>;
    getLastSession: () => Promise<PomodoroSession | undefined>; 
}

const defaultContextValue: PomodoroSessionContextType = {
    lastSession: undefined,
    addSession: async () => {},
    getSessions: async () => undefined,
    getLastSession: async () => undefined,
};

export const PomodoroSessionContext = createContext<PomodoroSessionContextType>(defaultContextValue);