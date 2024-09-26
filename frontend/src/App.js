import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginFormUI from "./components/LoginFormUI";
import MainFormUI from "./components/MainFormUI";
import DashBoard from "./components/DashBoard";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("UserInfo");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginFormUI setUser={setUser} />} exact />
        <Route path="/register" element={<MainFormUI />} />
        <Route path="/dashboard" element={<DashBoard user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
