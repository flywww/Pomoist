
import { useContext, useState, useEffect } from "react";
import { PomodoroContext } from "../context/pomodoroContext";
import { TodoContext } from "../context/todoContext";
import { Todo } from "../utils/db";

export const Timer = () => {
    const pomodoroContext = useContext(PomodoroContext);
    if (!pomodoroContext) {
        throw new Error("Timer must be used within a PomodoroProvider");
    }
    const todoContext = useContext(TodoContext);
    if (!todoContext){
        throw new Error("Todo must be used within a TodoProvider");
    }
    const { mode, time, onGoingSession } = pomodoroContext;
    const { getTodo } = todoContext;
    const [onGoingTodo, setOnGoingTodo] = useState<Todo>()
    const [pomodoroTitle, setPomodoroTitle] = useState<string>("");
    const minutes:string = (Math.floor(time/60)).toString().padStart(2,'0');
    const seconds:string = (time%60).toString().padStart(2, '0');
    
    useEffect(() => {
        const loadOnGoingTodo = async () => {
            if(onGoingSession.todoId){
                const newOnGoingTodo:Todo | undefined = await getTodo(onGoingSession.todoId);
                newOnGoingTodo && setOnGoingTodo(newOnGoingTodo);
            }else{
                setOnGoingTodo(undefined);
            }
        }
        loadOnGoingTodo();
    }, [onGoingSession, getTodo]);

    useEffect(() => {
        setPomodoroTitle("");
        switch (mode) {
            case 'focus':
                onGoingTodo && setPomodoroTitle(onGoingTodo.title);
                break;
            case "shortBreak":
                setPomodoroTitle("Short Break Time!");
                break;
            case "longBreak":
                setPomodoroTitle("Long Break Time!");
                break;
            default:
                setPomodoroTitle("")
                break;
        }
    },[mode, onGoingTodo])

    return(
        <div className="timerSector">
            <h3 className="timerSector__onGoingTask">{pomodoroTitle}</h3>
            <h2 className="timerSector__timer"> {minutes} : {seconds} </h2>
        </div>
    )
}