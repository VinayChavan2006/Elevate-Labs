import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const token = localStorage.getItem("token");
  const [isAuth, setIsAuth] = useState(token !== null);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuth ? <Navigate to="/chat" /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />} >
        <Route path="/chat" element={<ChatPage/>} />
      </Route>
    </Routes>
  );
}

export default App;
