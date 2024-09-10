import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Header from "./Header";
import Login from "./InfoLogin/Login";
import Register from "./InfoRegister/InputEmail";
import Footer from "./Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="page">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
export default App;
