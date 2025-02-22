import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResetPassword from "./ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
