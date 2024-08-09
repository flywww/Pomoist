import { useReducer, useEffect } from "react";
import { Settings } from "../utils/db"
import { useSettings } from "./useSettings";

type PomodoroMode = "focus" | "shortBreak" | "longBreak";
type PomodoroAction = 
  { type: "START_TIMER" } |
  { type: "PAUSE_TIMER"} | 
  { type: "RESET_TIMER", defaultSettings: Settings} | 
  { type: "TICK"} | 
  { type: "COMPLETE_SESSION"};
interface PomodoroState {
  mode: PomodoroMode;
  time: number;
  isActive: boolean;
  sessionCompleted: number;
}

const pomodoroReducer = (state: PomodoroState, action: PomodoroAction) :PomodoroState => {
  let newSessionCompleted: number;
  let newMode: PomodoroMode;

  switch (action.type) {
    case "START_TIMER":
      return {...state, isActive: true}
    case "PAUSE_TIMER":
      return {...state, isActive: false}
    case "RESET_TIMER":
      return {...state, time: action.defaultSettings.focusTime*60, isActive: false }
    case "TICK":
      return {...state, time: state.time - 1}
    case "COMPLETE_SESSION":
      newSessionCompleted = state.mode === "focus"? state.sessionCompleted+1:state.sessionCompleted;  
      newMode = "focus";
      if (state.mode === "focus") {
        newMode = newSessionCompleted % 4 === 0 ? "longBreak" : "shortBreak";
      }
      //TODO: Save session to to db
      return{
        ...state,
        mode: newMode,
        isActive: false,
        sessionCompleted: newSessionCompleted,
      }
    default:
      return state;
  }
} 

export const usePomodoro = () => {
  const {settings} = useSettings();
  const initialState: PomodoroState = {
    mode: "focus",
    time: settings.focusTime * 60,
    isActive: false,
    sessionCompleted: 0
  };

  const [state, dispatch] = useReducer(pomodoroReducer, initialState);

  useEffect(() => {
    let interval: number | undefined;
    if(state.isActive === true && state.time > 0){
      interval = setInterval(()=>{
        dispatch({type: "TICK"});
      }, 1000)
    }else if(state.time === 0){
      dispatch({type: "COMPLETE_SESSION"});
    }
    return () => {clearInterval(interval)};
  }, [state.isActive, state.time])

  const startTimer = () => dispatch({type: "START_TIMER"});
  const pauseTimer = () => dispatch({type: "PAUSE_TIMER"});
  const resetTimer = () => dispatch({type: "RESET_TIMER", defaultSettings: settings});

  return{
    ...state,
    startTimer,
    pauseTimer,
    resetTimer
  };
};