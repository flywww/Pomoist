import { useCallback, useContext, useMemo, useState } from "react"
import { TodoContext } from "../context/todoContext"
import { PomodoroContext } from "../context/pomodoroContext";
import { Todo } from "../utils/db";
import { TodoItem } from "./TodoItem";
import {IconButton} from "./IconButton"
import plusImagURL from "../assets/component/button/plus.png"

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
    const addTodoButtonClicked = (e: React.FormEvent<HTMLFormElement>)  => {
        e.preventDefault();  
        addTodo(newTodo);
        setNewTodo(initialNewTodo);
      }

    type TodoCondition = 'All' | "Active" | "Archived" | "Completed";
    const filterTodos = useCallback((todos: Todo[], condition: TodoCondition) => {
      switch (condition) {
        case 'All':
          return todos;
        case 'Active':
          return todos.filter( todo => todo.completed === false);
        case 'Completed':
          return todos.filter( todo => todo.completed === true);
        default:
          return todos;
      }
    },[])

    const visibleTodos = useMemo(() => filterTodos(todos, 'Active'), [todos, filterTodos]);

    const renderTodoItems = () => {
      return visibleTodos.map( todo => <TodoItem key={todo.id} {...todo}/> )
    }

    return(
        <>
           <div>
            <form
              className="addTodoForm" 
              onSubmit={addTodoButtonClicked}>
              <input 
                className="textInput"
                type="text" 
                value={newTodo.title}
                onChange={e => setNewTodo({...newTodo, title: e.target.value})}
                placeholder="Add a new task"
              />
              <IconButton 
                buttonType="submit"
                buttonColor="primary"
                buttonSize="medium"
                imgURL={plusImagURL}
                imgDescribe="Add todo"
              />
            </form>
          </div>
          <ul>
            {renderTodoItems()}
          </ul>
        </>
    )
}