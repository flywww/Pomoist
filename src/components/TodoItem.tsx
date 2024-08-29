import { useContext, useState, useEffect, useRef } from "react"
import { TodoContext } from "../context/todoContext"
import { PomodoroContext } from "../context/pomodoroContext";
import { Todo, TodoState } from "../utils/db";
import { useSettings } from "../hooks/useSettings";
import { SmallIconButton } from "./SmallIconButton";
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
  

    //Control buttons render functions
    const renderControlButtons = () => {
      if(todoState === "todo" && !isActive && onGoingTodoId === undefined && mode === "focus"){
        return (
          (!editingTodo && isHovered) && <SmallIconButton 
            onClick={handleStart}
            buttonColor="primary"
            imgURL={playImgURL}
            imgDescribe="Start timer"
          />
        )
      }
      if(todoState === "doing"){
        return(
        <>
          <SmallIconButton 
            onClick={handlePause}
            buttonColor="primary"
            imgURL={pauseImgURL}
            imgDescribe="Pause timer"
          />
          <SmallIconButton 
            onClick={handleReset}
            buttonColor="primary"
            imgURL={stopImgURL}
            imgDescribe="Stop timer"
          />
        </>)
      }
      if(todoState === "pending"){
        return(
        <>
          <SmallIconButton 
            onClick={handleResume}
            buttonColor="primary"
            imgURL={resumeImgURL}
            imgDescribe="Resume timer"
          />
          <SmallIconButton 
            onClick={handleReset}
            buttonColor="primary"
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
                  onChange={ () => completeTodo(id)}
                />
                {renderControlButtons()}
                <form
                  className="todoForm"
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
                  
                  {editingTodo && <SmallIconButton 
                    buttonType="submit"
                    buttonColor="primary"
                    imgURL={checkImgURL}
                    imgDescribe="Save todo"
                  />}
                </form>
              </div>
              <div className="todoItem__rightSector">
                <p className="todoItem__timeSpend">
                  {Math.floor(timeSpend/60)} mins
                </p>
                {(!editingTodo && isHovered && !isActive) && <SmallIconButton 
                  onClick={handleTodoDelete}
                  buttonColor="secondary"
                  imgURL={trashImgURL}
                  imgDescribe="Delete todo"
                />}
                {(!editingTodo && isHovered && !isActive) && <SmallIconButton 
                  onClick={handleTodoEdit}
                  buttonColor="secondary"
                  imgURL={editImgURL}
                  imgDescribe="Edit todo"
                />}
              </div>
            </div>
      </div> 
    )
}