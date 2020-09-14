import React from "react";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./components/routing/AppRoutes";
import logo from "./logo.svg";
import "./styles/css/app.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <AppRoutes />
    </div>
  );
}

export default App;
