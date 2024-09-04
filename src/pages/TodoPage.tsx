
import { Timer } from "../components/Timer";
import { TodoList } from "../components/TodoList";
import { PomodoroProvider } from "../context/PomodoroProvider";
import { PomodoroSessionProvider } from "../context/PomodoroSessionProvider";
import { TodoProvider } from "../context/TodoProvider";


export const TodoPage = () => {
    return (
        <>
            <PomodoroSessionProvider>
              <TodoProvider>
                <PomodoroProvider>
                  <div className="todoPage">
                    <Timer/>
                    <TodoList/>
                  </div>
                </PomodoroProvider>
              </TodoProvider>
            </PomodoroSessionProvider>
       </> 
    )
}