import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminPage from "./AdminPage";
import UserDashboard from "./UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} /> {/* ✅ Admin route */}
        <Route path="/dashboard" element={<UserDashboard />} /> {/* ✅ User page */}
      </Routes>
    </Router>
  );
}

export default App;
