import { useContext, useState, useEffect, useRef } from "react"
import { TodoContext } from "../context/todoContext"
import { PomodoroContext } from "../context/pomodoroContext";
import { Todo, TodoState } from "../utils/db";
import { IconButton } from "./IconButton"
import playImgURL from "../assets/component/button/play.png"
import pauseImgURL from "../assets/component/button/pause.png"
import stopImgURL from "../assets/component/button/stop.png"
import resumeImgURL from "../assets/component/button/resume.png"
import checkImgURL from "../assets/component/button/check.png"
import trashImgURL from "../assets/component/button/trash.png"
import editImgURL from "../assets/component/button/edit.png"

export const TodoItem = ({ id, title, completed, timeSpend }: Todo) => {

    const [editingTodo, setEditingTodo] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [todoState, setTodoState] = useState<TodoState>("todo");
    const todoContext = useContext(TodoContext);
    if (!todoContext) {
        throw new Error("todo must be used within a TodoProvider");
    }
    const pomodoroContext = useContext(PomodoroContext);
    if (!pomodoroContext) {
        throw new Error("Timer must be used within a PomodoroProvider");
    }
    const {time, isActive, mode, onGoingSession, startTimer, pauseTimer, resetTimer} = pomodoroContext;
    const {completeTodo, deleteTodo ,updateTodo} = todoContext;
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
    },[isActive, todoState, time])

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

    const handleCompleteTodo = () => {
      id === onGoingSession?.todoId && handleReset();
      completeTodo(id);
    }
  

    //Control buttons render functions
    const renderControlButtons = () => {
      if(todoState === "todo" && !isActive && onGoingSession?.todoId === undefined && mode === "focus"){
        return (
          (!editingTodo && isHovered) && <IconButton 
            onClick={handleStart}
            buttonColor="primary"
            buttonSize="small"
            imgURL={playImgURL}
            imgDescribe="Start timer"
          />
        )
      }
      if(todoState === "doing"){
        return(
        <>
          <IconButton 
            onClick={handlePause}
            buttonColor="primary"
            buttonSize="small"
            imgURL={pauseImgURL}
            imgDescribe="Pause timer"
          />
          <IconButton 
            onClick={handleReset}
            buttonColor="primary"
            buttonSize="small"
            imgURL={stopImgURL}
            imgDescribe="Stop timer"
          />
        </>)
      }
      if(todoState === "pending"){
        return(
        <>
          <IconButton 
            onClick={handleResume}
            buttonColor="primary"
            buttonSize="small"
            imgURL={resumeImgURL}
            imgDescribe="Resume timer"
          />
          <IconButton 
            onClick={handleReset}
            buttonColor="primary"
            buttonSize="small"
            imgURL={stopImgURL}
            imgDescribe="Stop timer"
          />
        </>)
      }
    }

    return(
      <div
        onMouseEnter={()=>{setIsHovered(true)}}
        onMouseLeave={()=>{setIsHovered(false)}}
        >
          <div className="todoItem">
              <div className="todoItem__leftSector">
                <input
                  className="checkbox"
                  type="checkbox" 
                  checked = {completed}
                  onChange={handleCompleteTodo}
                />
                {renderControlButtons()}
                <form
                  className="editTodoForm"
                  onSubmit={handleTodoSave} 
                >
                  <input
                    className={editingTodo ? "textInput--editing" : "textInput" }
                    type="text"  
                    name="todoTitle"
                    defaultValue={title}
                    readOnly = {!editingTodo}
                    ref = {todoInputRef}
                  />
                  
                  {editingTodo && <IconButton 
                    buttonType="submit"
                    buttonColor="primary"
                    buttonSize="small"
                    imgURL={checkImgURL}
                    imgDescribe="Save todo"
                  />}
                </form>
              </div>
              <div className="todoItem__rightSector">
                <p className="todoItem__timeSpend">
                  {Math.floor(timeSpend)} secs
                </p>
                {(!editingTodo && isHovered && !isActive) && <IconButton 
                  onClick={handleTodoDelete}
                  buttonColor="secondary"
                  buttonSize="small"
                  imgURL={trashImgURL}
                  imgDescribe="Delete todo"
                />}
                {(!editingTodo && isHovered && !isActive) && <IconButton 
                  onClick={handleTodoEdit}
                  buttonColor="secondary"
                  buttonSize="small"
                  imgURL={editImgURL}
                  imgDescribe="Edit todo"
                />}
              </div>
            </div>
      </div> 
    )
}