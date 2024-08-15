import {db, PomodoroSession} from "../utils/db"

export const usePomodoroSession = () => {
    

    const getTodoTimeSpend = async (id: number): Promise<number> => {
        try {
            const totalTimeReducer = (totalTime: number, session: PomodoroSession) => totalTime + session.duration;
            const timeSpend = await db.pomodoroSessions.where("todoId")
                                                        .equals(id)
                                                        .toArray(sessions => sessions.reduce(totalTimeReducer, 0));
            return timeSpend;
        } catch (error) {
            console.error(`TimeSpend can't find or calculate with id:${id}`, error);
            return 0;
        }
    }

    const addSession = async (session: PomodoroSession) => {
        try {
            await db.pomodoroSessions.add(session);
        } catch (error) {
            console.error(`Can't add session to db`, error);
        }
    }

    return {addSession ,getTodoTimeSpend}
}
