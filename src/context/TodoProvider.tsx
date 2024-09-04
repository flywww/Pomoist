import React, { useEffect, useState, useCallback, useContext }  from "react"
import { TodoContext } from "./todoContext"
import {db, Todo, PomodoroSession} from "../utils/db"
import { PomodoroSessionContext } from "./pomodoroSessionContext"

export const TodoProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const { lastSession, getSessions } = useContext(PomodoroSessionContext);

    const loadTodos = useCallback(async() => {
        try {
            const loadedTodos = await db.todos.toArray();
            setTodos(loadedTodos);
        } catch (error) {
            console.error("fail to load todos", error);
        }
    } ,[]);

    const getTodo = useCallback(async (id:number) :Promise<Todo | undefined> => {
        try {
            const todo: Todo | undefined = await db.todos.get(id);
            return todo;
        } catch (error) {
            console.error(`Error fetching todo with id: ${id}`, error);
            return undefined;
        }
    },[])

    const addTodo = useCallback(async (todo: Todo) => {
        try {
            const newTodo = {...todo};
            setTodos(prevTodos => [...prevTodos, newTodo]);
            await db.todos.add(newTodo);
            await loadTodos();
        } catch (error) {
            console.error("fail to add todos", error);
        }
    },[loadTodos])

    const deleteTodo = useCallback(async (id: number | undefined) => {
        if(id === undefined) {
            console.error(`Todo with id ${id} can not be undefined!`)
            return;
        }
        try {
            setTodos(prevTodos => prevTodos.filter( todo => todo.id !==id));
            await db.todos.delete(id);
        } catch (error) {
            console.error("fail to delete todos", error);
        }
    },[])

    const updateTodo = useCallback(async (id:number | undefined, newTodo: Omit<Partial<Todo>, "id">) => {
        const existingTodo = todos.find( todo => todo.id === id)
        if(!existingTodo){
            console.error(`Todo with id ${id} not found!`)
            return
        }
        if(id === undefined) {
            console.error(`Todo with id ${id} can not be undefined!`)
            return;
        }
        try {
            const updatedTodo = {...existingTodo , ...newTodo};
            setTodos(prevTodos => prevTodos.map (todo => todo.id ===id ? updatedTodo : todo));    
            await db.todos.update(id, updatedTodo);
        } catch (error) {
            console.error("fail to update todos", error);
        }
    },[todos])

    const completeTodo = useCallback(async (id:number | undefined) => {
        try {
            await updateTodo(id, {completed: true});
        } catch (error) {
            console.error(`Error complete todo with id: ${id}`, error);
        }
        
    },[updateTodo])

    const updateTodoTimeSpend = useCallback(async () => {
        if (!lastSession?.todoId || !getSessions) return;
        try {
            const totalTimeReducer = (totalTime: number, session: PomodoroSession) => totalTime + session.duration;
            const loadedSessions = await getSessions({todoId: lastSession.todoId});
            const newTodoTimeSpend = loadedSessions?.reduce(totalTimeReducer, 0);
            updateTodo(lastSession.todoId, {timeSpend: newTodoTimeSpend});
        } catch (error) {
            console.error(`Could not to update todo time spend.`, error);
        }
      },[getSessions, updateTodo, lastSession])

    useEffect(() => {
        updateTodoTimeSpend(); 
    }, [lastSession])

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    return(
        <TodoContext.Provider value={{todos, getTodo, addTodo, deleteTodo, updateTodo, completeTodo}}>
            {children}
        </TodoContext.Provider>
    )
}