import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home.jsx";
//import ChatRoom from "./components/ChatRoom.jsx";
import UseChat from "./useChat.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/:roomId' element={<UseChat/>} />
      </Routes>
    </Router>
  );
}

export default App;