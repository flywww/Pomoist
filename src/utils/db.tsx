import Dexie, { type EntityTable } from "dexie";

// Todo interface
export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}

// PomodoroSession interface
export interface PomodoroSession{
    id?: number;
    startTime: Date;
    duration: number;
    todoId?: number;
}

// Setting interface
export interface Settings{
    id?: number;
    focusTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    breakInterval: number;
    alarmSoundEnabled: boolean;
    notificationEnabled: boolean;
}

// Dexie db setting
const db = new Dexie('AppDatabase') as Dexie & {
    todos: EntityTable<Todo, 'id'>;
    pomodoroSessions: EntityTable<PomodoroSession, 'id'>;
    settings: EntityTable<Settings, 'id'>;
}

db.version(1).stores({
    todos: '++id, title, completed',
    pomodoroSessions: '++id, startTime, duration, todoId',
    settings: '++id'
})

// export db
export {db}