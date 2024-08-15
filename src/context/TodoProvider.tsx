import React, { useEffect, useState, useCallback }  from "react"
import { TodoContext } from "./todoContext"
import {db, Todo} from "../utils/db"

export const TodoProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [todos, setTodos] = useState<Todo[]>([]);

    const loadTodos = useCallback(async() => {
        try {
            const loadedTodos = await db.todos.toArray();
            setTodos(loadedTodos);
        } catch (error) {
            console.error("fail to load todos", error);
        }
    } ,[]);

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
            await loadTodos();
        } catch (error) {
            console.error("fail to delete todos", error);
        }
    },[loadTodos])

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
            await loadTodos();
        } catch (error) {
            console.error("fail to update todos", error);
        }
    },[loadTodos, todos])

    const completeTodo = useCallback((id:number | undefined) => {
        updateTodo(id, {completed: true});
    },[updateTodo])

    const getTodo = useCallback(async (id:number) :Promise<Todo | undefined> => {
        try {
            const todo: Todo | undefined = await db.todos.get(id);
            return todo;
        } catch (error) {
            console.error(`Error fetching todo with id: ${id}`, error);
            return undefined;
        }
    },[])

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    return(
        <TodoContext.Provider value={{todos, getTodo, addTodo, deleteTodo, updateTodo, completeTodo}}>
            {children}
        </TodoContext.Provider>
    )
}