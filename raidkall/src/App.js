import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./components/home.jsx";
import ChatRoom from "./components/ChatRoom.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/:roomId' element={<ChatRoom/>} />
      </Routes>
    </Router>
  );
}

export default App;