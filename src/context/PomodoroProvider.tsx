import React, {useCallback, useEffect, useReducer} from "react";
import { useSettings } from "../hooks/useSettings";
import { Settings } from "../utils/db";
import { PomodoroContext, PomodoroState, PomodoroAction, PomodoroMode } from "./pomodoroContext";

const calculateNewTime = (mode: PomodoroMode, settings:Settings) => {
  switch (mode) {
    case "focus": 
      return settings.focusTime*60;
      break;
    case "shortBreak": 
      return settings.shortBreakTime*60;
      break;
    case "longBreak": 
      return settings.longBreakTime*60;
      break;
    default:
      return settings.focusTime*60;
      break;
  }
}

const pomodoroReducer = (state: PomodoroState, action: PomodoroAction) :PomodoroState => {
    let newSessionCompleted: number;
    let newMode: PomodoroMode;
    let newTime: number;
  
    switch (action.type) {
      case "START_TIMER":
        //TODO: if mode is focus then set focusedTodo
        return {...state, isActive: true}
      case "PAUSE_TIMER":
        return {...state, isActive: false}
      case "RESET_TIMER":
        //TODO: If mode is focus then update focusedTodo to todo db with timeSpend
        return {...state, time: action.defaultSettings.focusTime*60, isActive: false }
      case "TICK":
        return {...state, time: state.time - 1}
      case "COMPLETE_SESSION":
        newSessionCompleted = state.mode === "focus"? state.sessionCompleted+1:state.sessionCompleted;  
        newMode = "focus";
        if (state.mode === "focus") {
          newMode = newSessionCompleted % action.defaultSettings.breakInterval === 0 ? "longBreak" : "shortBreak";
        }
        newTime = calculateNewTime(newMode, action.defaultSettings);
      
        //TODO: Save session to to db
        return{
          ...state,
          mode: newMode,
          time: newTime,
          isActive: false,
          sessionCompleted: newSessionCompleted,
        }
      default:
        return state;
    }
} 

export const PomodoroProvider: React.FC< {children: React.ReactNode} > = ({children}) => {
  const {settings} = useSettings();
    
  //TODO: time Load from session
  const initialState: PomodoroState = {
    mode: "focus",
    time: settings.focusTime * 60,
    isActive: false,
    sessionCompleted: 0
  };

  const [state, dispatch] = useReducer(pomodoroReducer, initialState);

  useEffect(() => {
    dispatch({type: "RESET_TIMER", defaultSettings: settings});
  }, [settings])

  useEffect(() => {
    let interval: number | undefined;
    if(state.isActive === true && state.time > 0){
      interval = setInterval(()=>{
        dispatch({type: "TICK"});
      }, 1000)
    }else if(state.time === 0){
      dispatch({type: "COMPLETE_SESSION", defaultSettings: settings});
    }
    return () => {clearInterval(interval)};
  }, [state.isActive, state.time, settings])

  const startTimer = useCallback(() => dispatch({type: "START_TIMER"}), []);
  const pauseTimer = useCallback(() => dispatch({type: "PAUSE_TIMER"}), []);
  const resetTimer = useCallback(() => dispatch({type: "RESET_TIMER", defaultSettings: settings}), [settings]);

  return(
        <PomodoroContext.Provider value = {{...state, startTimer, pauseTimer, resetTimer}}>
            {children}
        </PomodoroContext.Provider>
    );
}