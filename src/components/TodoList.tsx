import { useContext, useState } from "react"
import { TodoContext } from "../context/todoContext"
import { PomodoroContext } from "../context/pomodoroContext";
import { Todo } from "../utils/db";
import { TodoItem } from "./TodoItem";

export const TodoList = () => { 
  const initialNewTodo: Todo = {
        title: "",
        completed: false,
        timeSpend: 0,
        state: "todo"
      }

    const [newTodo, setNewTodo] = useState<Todo>(initialNewTodo);

    const todoContext = useContext(TodoContext);
    if (!todoContext) {
        throw new Error("todo must be used within a TodoProvider")
    }
    const pomodoroContext = useContext(PomodoroContext);
    if (!pomodoroContext) {
        throw new Error("Timer must be used within a PomodoroProvider");
    }
    
    const {todos, addTodo} = todoContext;


    const addTodoButtonClicked = async () => {
        await addTodo(newTodo);
        setNewTodo(initialNewTodo);
      }

    return(
        <>
           <div>
              <input 
                type="text" 
                value={newTodo.title}
                onChange={e => setNewTodo({...newTodo, title: e.target.value})}
                placeholder="Add a new task"
              />
              <button onClick={addTodoButtonClicked}>add</button>
            </div>
            <ul>
              { todos.map(todo => <TodoItem key={todo.id} {...todo}/> )}
            </ul>
        </>
    )
}