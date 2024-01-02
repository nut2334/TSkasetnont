import React from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import TabLogin from "./components/tab-login";
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TabLogin />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
