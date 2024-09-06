import React, {useCallback, useContext, useEffect, useReducer} from "react";
import { PomodoroSession, Settings } from "../utils/db";
import { PomodoroSessionContext } from "./pomodoroSessionContext";
import { PomodoroContext, PomodoroState, PomodoroAction, PomodoroMode } from "./pomodoroContext";
import { SettingsContext } from "./settingsContext";


const calculateNewTime = (mode: PomodoroMode, settings:Settings) => {
  switch (mode) {
    case "focus": 
      return settings.focusTime*60;
    case "shortBreak": 
      return settings.shortBreakTime*60;
    case "longBreak": 
      return settings.longBreakTime*60;
    default:
      return settings.focusTime*60;
  }
}

const pomodoroReducer = (state: PomodoroState, action: PomodoroAction) :PomodoroState => {
    let newSessionCompleted: number;
    let newMode: PomodoroMode;
    let newTime: number;
    let isActiveForBreak: boolean;
    
    const initialSession: PomodoroSession = {
      ...state.onGoingSession,
      startTime: undefined,
      duration: 0,
      todoId: undefined
    }
    const newStartTime: Date = new Date();
    let newSession: PomodoroSession;
  
    switch (action.type) {
      case "START_TIMER":
        newSession = {
          ...state.onGoingSession,
          startTime: state.onGoingSession.startTime || newStartTime,
          todoId: action.onGoingTodoId,
        }
        return {
                ...state, 
                isActive: true, 
                onGoingSession: newSession
              }
      case "PAUSE_TIMER":
        return {
            ...state, 
            isActive: false,
            onGoingSession: initialSession
          }
      case "RESET_TIMER":
        return {
                  ...state, 
                  time: action.defaultSettings.focusTime*60, 
                  isActive: false, 
                  mode: "focus",
                  onGoingSession: initialSession
                }
                
      case "TICK":
        return {
            ...state, 
            time: state.time - 1,
            onGoingSession: {
              ...state.onGoingSession,
              duration: state.onGoingSession.duration + 1
            }
          }
      case "COMPLETE_SESSION":
        newSessionCompleted = state.mode === "focus"? state.sessionCompleted+1:state.sessionCompleted;  
        newMode = "focus";
        if (state.mode === "focus") {
          newMode = newSessionCompleted % action.defaultSettings.breakInterval === 0 ? "longBreak" : "shortBreak";
        }
        newTime = calculateNewTime(newMode, action.defaultSettings);
        isActiveForBreak = newMode !== "focus";

        return{
          ...state,
          mode: newMode,
          time: newTime,
          isActive: isActiveForBreak,
          sessionCompleted: newSessionCompleted,
          onGoingSession: initialSession
        }
      default:
        return state;
    }
} 

export const PomodoroProvider: React.FC< {children: React.ReactNode} > = ({children}) => {
  
  const settingsContext = useContext(SettingsContext);
  if (!settingsContext){
    throw Error ("Settings must be used within a PomodoroProvider");
  }
  const { settings } = settingsContext;

  const initialSession: PomodoroSession = {
    startTime: new Date(),
    duration: 0,
    todoId: undefined
  }

  const initialState: PomodoroState = {
    mode: "focus",
    time: settings.focusTime * 60,
    isActive: false,
    sessionCompleted: 0,
    onGoingSession: initialSession,
  };

  const [state, dispatch] = useReducer(pomodoroReducer, initialState);
  const { addSession } = useContext(PomodoroSessionContext);

  useEffect(() => {
    let interval: number | undefined;
    if(state.isActive === true && state.time > 0){
      interval = setInterval(()=>{
        dispatch({type: "TICK"});
      }, 1000)
    }else if(state.time === 0){
      state.onGoingSession.todoId && addSession(state.onGoingSession);
      dispatch({type: "COMPLETE_SESSION", defaultSettings: settings});
    }
    return () => {clearInterval(interval)};
  }, [state.isActive, state.time, settings])

  useEffect(()=>{
    if(state.isActive === false){
      dispatch({type: "RESET_TIMER", defaultSettings: settings})
    }
  },[settings])

  const startTimer = useCallback((onGoingTodoId:number | undefined) => {
    dispatch({type: "START_TIMER", onGoingTodoId: onGoingTodoId})
}, []);

  const pauseTimer = useCallback(() => {
    state.onGoingSession.todoId && addSession(state.onGoingSession);
    dispatch({type: "PAUSE_TIMER"});
}, [state, addSession]);

  const resetTimer = useCallback(() => {
    state.onGoingSession.todoId && addSession(state.onGoingSession);
    dispatch({type: "RESET_TIMER", defaultSettings: settings})
  }, [settings, state, addSession]);

  return(
        <PomodoroContext.Provider value = {{...state, startTimer, pauseTimer, resetTimer}}>
            {children}
        </PomodoroContext.Provider>
    );
}