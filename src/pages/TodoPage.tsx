
import { Timer } from "../components/Timer";
import { TodoList } from "../components/TodoList";

export const TodoPage = () => {
    return (
      <div className="todoPage">
        <Timer/>
        <TodoList/>
      </div>
    )
}