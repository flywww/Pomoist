
import { useContext } from "react";
import { PomodoroContext } from "../context/pomodoroContext";

export const Timer = () => {
    const pomodoroContext = useContext(PomodoroContext);
    if (!pomodoroContext) {
        throw new Error("Timer must be used within a PomodoroProvider");
    }
    const {time, mode, resetTimer} = pomodoroContext;
    const minutes:string = (Math.floor(time/60)).toString().padStart(2,'0');
    const seconds:string = (time%60).toString().padStart(2, '0');
    return(
        <>
            <h2> {minutes} : {seconds} </h2>
            {mode !== "focus" && <button onClick={resetTimer}> Skip Break </button>}
        </>
    )
}