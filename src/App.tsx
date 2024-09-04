import { SettingPage } from "./pages/SettingPage"
import { TodoPage } from "./pages/TodoPage"
import { Route, Routes } from "react-router-dom"
import { NavigationBar } from "./components/NavigationBar"

function App() {
  return (
    <div className="app">
      <NavigationBar/>
      <Routes>
        <Route path="/" element = {<TodoPage />}></Route>
        <Route path="/setting" element = {<SettingPage />}></Route>
      </Routes>
    </div>
  )
}

export default App
