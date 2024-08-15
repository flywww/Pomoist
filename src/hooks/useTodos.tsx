import { useEffect, useState } from "react";
import {db, Todo} from "../utils/db"

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const loadTodos = async() => {
            try {
                const loadedTodos = await db.todos.toArray();
                setTodos(loadedTodos);
            } catch (error) {
                console.error("fail to load todos", error);
            }
        }
        loadTodos();
    }, []);

    const addTodo = async (todo: Todo) => {
        try {
            const newTodo = {...todo};
            setTodos(prevTodos => [...prevTodos, newTodo]);
            await db.todos.add(newTodo);
        } catch (error) {
            console.error("fail to add todos", error);
        }
    }
    const deleteTodo = async (id: number | undefined) => {
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
    }

    type TodoUpdate = Omit<Partial<Todo>, "id">
    const updateTodo = async (id:number | undefined, newTodo: TodoUpdate) => {
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
    }

    const completeTodo = (id:number | undefined) => {
        updateTodo(id, {completed: true});
    }

    const getTodo = async (id:number) :Promise<Todo | undefined> => {
        try {
            const todo: Todo | undefined = await db.todos.get(id);
            return todo;
        } catch (error) {
            console.error(`Error fetching todo with id: ${id}`, error);
            return undefined;
        }
    }

    return{todos, getTodo, addTodo, deleteTodo, updateTodo, completeTodo}
}