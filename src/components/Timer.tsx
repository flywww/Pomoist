
import { useContext } from "react";
import { PomodoroContext } from "../context/pomodoroContext";

export const Timer = () => {
    const pomodoroContext = useContext(PomodoroContext);
    if (!pomodoroContext) {
        throw new Error("Timer must be used within a PomodoroProvider");
    }
    const {time, startTimer, pauseTimer, resetTimer} = pomodoroContext;
    const minutes:string = (Math.floor(time/60)).toString().padStart(2,'0');
    const seconds:string = (time%60).toString().padStart(2, '0');
    return(
        <>
            <h2> {minutes} : {seconds} </h2>
            <button onClick={startTimer}> Start </button>
            <button onClick={pauseTimer}> Pause </button>
            <button onClick={resetTimer}> Reset </button>
        </>
    )
}