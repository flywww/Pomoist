import { useContext, useState } from "react"
import { TodoContext } from "../context/todoContext"
import { PomodoroContext } from "../context/pomodoroContext";
import { Todo } from "../utils/db";



export const TodoList = () => {
    const initialNewTodo: Todo = {
        title: "",
        completed: false,
        timeSpend: 0
      }

    const [newTodo, setNewTodo] = useState(initialNewTodo);
    const [editingTodo, setEditingTodo] = useState<boolean>(false)

    const todoContext = useContext(TodoContext);
    if (!todoContext) {
        throw new Error("todo must be used within a TodoProvider")
    }
    const pomodoroContext = useContext(PomodoroContext);
    if (!pomodoroContext) {
        throw new Error("Timer must be used within a PomodoroProvider");
    }
    const {startTimer, pauseTimer, resetTimer} = pomodoroContext;
    const {todos, addTodo, completeTodo, deleteTodo} = todoContext;


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