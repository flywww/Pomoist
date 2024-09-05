import React, { useState, useEffect, useCallback } from "react";
import {db, PomodoroSession} from "../utils/db"
import { PomodoroSessionContext } from "./pomodoroSessionContext"

export const PomodoroSessionProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    
    const [lastSession, setLastSession] = useState<PomodoroSession | undefined>(undefined);

    const loadLastSession = useCallback(async () => {
        try {
            const loadedLastSession = await getLastSession();
            setLastSession(loadedLastSession);
        } catch (error) {
            console.error(`load last session error`, error);
            setLastSession(undefined);
        }
    },[]);

    const getLastSession = useCallback(async (): Promise<PomodoroSession | undefined> => {
        try {
            const lastSession = await db.pomodoroSessions.orderBy('id').last();
            return lastSession;
        } catch (error) {
            console.error(`Can not load last session:`, error);
            return undefined;
        }
    },[])

    const addSession = useCallback(async (session: PomodoroSession) => {
        try {
            await db.pomodoroSessions.add(session);
            loadLastSession();
        } catch (error) {
            console.error(`Can't add session to db`, error);
        }
    },[loadLastSession])

    const getSessions = useCallback(async (filter: {id?:number, todoId?:number}): Promise<PomodoroSession[] | undefined> => {
        try {
            let query = db.pomodoroSessions.toCollection();
            if(filter.id !== undefined){
                query = query.filter(session => session.id === filter.id);
            }else if(filter.todoId !== undefined){
                query = query.filter(session => session.todoId === filter.todoId);
            }
            const sessions: PomodoroSession[] = await query.toArray();
            return sessions;
        } catch (error) {
            console.error("could not get sessions", error);
            return undefined;
        }
    },[])

    useEffect(() => {
        loadLastSession();
    },[])

    return (
        <PomodoroSessionContext.Provider value={{lastSession, addSession, getLastSession, getSessions}}>
            {children}
        </PomodoroSessionContext.Provider>
    )
}
