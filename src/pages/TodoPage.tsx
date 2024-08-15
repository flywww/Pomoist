
import { Timer } from "../components/Timer";
import { TodoList } from "../components/TodoList";
import { PomodoroProvider } from "../context/PomodoroProvider";
import { TodoProvider } from "../context/TodoProvider";

export const TodoPage = () => {
    return (
        <>
            <TodoProvider>
              <PomodoroProvider>
                <Timer/>
                <TodoList/>
              </PomodoroProvider>
            </TodoProvider>
       </> 
    )
}