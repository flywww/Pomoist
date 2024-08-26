import { useContext, useState, useEffect, useRef } from "react"
import { TodoContext } from "../context/todoContext"
import { PomodoroContext } from "../context/pomodoroContext";
import { Todo, TodoState } from "../utils/db";
import { useSettings } from "../hooks/useSettings";

export const TodoItem = ({ id, title, completed, timeSpend }: Todo) => {

    const [editingTodo, setEditingTodo] = useState<boolean>(false)
    const [todoState, setTodoState] = useState<TodoState>("todo");
    const todoContext = useContext(TodoContext);
    if (!todoContext) {
        throw new Error("todo must be used within a TodoProvider");
    }
    const pomodoroContext = useContext(PomodoroContext);
    if (!pomodoroContext) {
        throw new Error("Timer must be used within a PomodoroProvider");
    }
    const {time, isActive, mode, onGoingTodoId, startTimer, pauseTimer, resetTimer} = pomodoroContext;
    const {completeTodo, deleteTodo, updateTodoTimeSpend ,updateTodo} = todoContext;
    const {settings} = useSettings()
    const todoInputRef = useRef<HTMLInputElement>(null)
  
    // Control button handle functions
    const handleStart = () => {
        resetTimer();
        startTimer(id);
        setTodoState("doing");  
    }

    const handlePause = () => {
      pauseTimer();
      setTodoState("pending");
    }

    const handleReset = () => {
      mode === "focus" && updateTodoTimeSpend(id, settings.focusTime*60 - time);
      resetTimer();
      setTodoState("todo");
    }

    const handleResume = () =>{
      startTimer(id);
      setTodoState("doing"); 
    }

    useEffect(()=>{
      if(!isActive && todoState === "doing"){
        setTodoState("todo");
      }
      // If time's up than update timeSpend
      if(todoState === "doing" && time === 0 && mode === "focus"){
        updateTodoTimeSpend(id, settings.focusTime*60);
      }
    },[isActive, todoState, time])

    //Control buttons render functions
    const renderControlButtons = () => {
      if(todoState === "todo" && !isActive && onGoingTodoId === undefined && mode === "focus"){
        return <button onClick={handleStart}> Start </button>
      }
      if(todoState === "doing"){
        return(
        <>
          <button onClick={handlePause}> Pause </button>
          <button onClick={handleReset}> Reset </button>
        </>)
      }
      if(todoState === "pending"){
        return(
        <>
          <button onClick={handleResume}> Resume </button>
          <button onClick={handleReset}> Reset </button>
        </>)
      }
    }

    //Todo edit, delete, save handle functions
    const handleTodoEdit = () => {
      setEditingTodo(true)
      setTimeout(() => {
        todoInputRef.current && todoInputRef.current.focus();
      }, 0)
    }

    const handleTodoDelete = () => {
      deleteTodo(id);
    }

    const handleTodoSave = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const todoTitle:string = (e.target as HTMLFormElement).todoTitle.value;
      updateTodo(id, {title: todoTitle});
      setEditingTodo(false);
    }

    //TODO: TimeSpend calculation

    return(
      <div>
          {!completed &&
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
              <input 
                type="checkbox" 
                checked = {completed}
                onChange={ () => completeTodo(id)}
              />
              {renderControlButtons()}
              <form onSubmit={handleTodoSave} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <input 
                  type="text"  
                  name="todoTitle"
                  defaultValue={title}
                  readOnly = {!editingTodo}
                  ref = {todoInputRef}
                  style={{
                    cursor: editingTodo ? 'text' : 'default',
                    border: editingTodo ? '1px solid #ccc' : 'none',
                    outline: editingTodo ? 'auto' : 'none',
                    }}
                />
                <button hidden={!editingTodo} type="submit">save</button>
              </form>
              <p>{Math.floor(timeSpend)} s</p>
              <button hidden={editingTodo} onClick={handleTodoDelete}>delete</button>
              <button hidden={editingTodo} onClick={handleTodoEdit}>edit</button>
            </div>
          }
      </div> 
    )
}