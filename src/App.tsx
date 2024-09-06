import { SettingPage } from "./pages/SettingPage"
import { TodoPage } from "./pages/TodoPage"
import { Route, Routes } from "react-router-dom"
import { NavigationBar } from "./components/NavigationBar"
import { PomodoroProvider } from "./context/PomodoroProvider";
import { TodoProvider } from "./context/TodoProvider";
import { PomodoroSessionProvider } from "./context/PomodoroSessionProvider";
import { SettingsProvider } from "./context/SettingsProvider"


function App() {
  return (
    <div className="appContainer">
      <div className="app">
        <SettingsProvider>
          <PomodoroSessionProvider>
            <TodoProvider>
              <PomodoroProvider>
                <NavigationBar />
                <Routes>
                  <Route path="/" element = {<TodoPage />}></Route>
                  <Route path="/setting" element = {<SettingPage />}></Route>
                </Routes>
              </PomodoroProvider>
            </TodoProvider>
          </PomodoroSessionProvider>
        </SettingsProvider>
      </div>
    </div>
  )
}

export default App
