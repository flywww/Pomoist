import { createContext } from "react";
import {Todo} from "../utils/db"

export interface TodoContextType {
    todos: Todo[];
    addTodo: (todo: Todo) => void;
    deleteTodo: (id:number | undefined) => void;
    updateTodo: (id:number | undefined, todo: Todo) => void;
    completeTodo: (id:number | undefined) => void;
    getTodo: (id: number) => Promise<Todo | undefined>
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);