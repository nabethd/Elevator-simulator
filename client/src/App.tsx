import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import "./App.css";
import Elevators from "./pages/Elevators";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App-header">
        <Routes>
          <Route path="/elevators" element={<Elevators />} />
          <Route path="/" element={<Main />} />
          <Route path="*" element={<Navigate to={"/"} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
