import { useState } from "react";
import { usePomodoro } from "../hooks/usePomodoro"
import { useTodos } from "../hooks/useTodos";
import { Todo } from "../utils/db";
import { Timer } from "../components/Timer";
import { TodoList } from "../components/TodoList";

import { PomodoroProvider } from "../context/PomodoroProvider";


//TODO: refactor usePomodoro, useTodos become context

export const TodoPage = () => {
  const {time, startTimer, pauseTimer, resetTimer} = usePomodoro();
  const {todos, getTodo, addTodo, updateTodo, deleteTodo, completeTodo} = useTodos();

  const initialNewTodo: Todo = {
    title: "",
    completed: false,
    timeSpend: 0
  }
  const [newTodo, setNewTodo] = useState(initialNewTodo);
  const [editingTodo, setEditingTodo] = useState<boolean>(false)

  const addTodoButtonClicked = async () => {
    await addTodo(newTodo);
    setNewTodo(initialNewTodo);
  }

    return (
        <>
            <PomodoroProvider>
              <Timer/>
              <button onClick={resetTimer}> Reset </button>
              <br />
            </PomodoroProvider>
            

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
              {
                todos.map(todo => {
                  return(
                    !todo.completed &&
                    <li key={todo.id}>
                      <input 
                        type="checkbox" 
                        checked = {todo.completed}
                        onChange={ async () => {
                          await completeTodo(todo.id)
                        }}
                      />
                      <button onClick={startTimer}> Start </button>
                      <button onClick={pauseTimer}> Pause </button>
                      <button onClick={resetTimer}> Reset </button>
                      <input 
                        type="text"  
                        value={todo.title}
                        readOnly = {!editingTodo}
                      />
                      <p>{todo.timeSpend}</p>
                      <button hidden={!editingTodo}>save</button>
                      <button onClick={ async () => {
                        await deleteTodo(todo.id);
                      }}>delete</button>
                      <button onClick={() => {setEditingTodo(!editingTodo)}}>edit</button>
                    </li>
                  )
                })
              }
            </ul>
       </> 
    )
}



/*

example: use context send timer to tree
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}

*/