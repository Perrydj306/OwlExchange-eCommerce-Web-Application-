import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminPage from "./AdminPage";
import UserDashboard from "./UserDashboard";
import LandingPage from "./LandingPage";
import SearchResults from "./SearchResults";
import ItemDetails from "./ItemDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing Page*/}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} /> {/* Admin route */}
        <Route path="/dashboard" element={<UserDashboard />} /> {/* User page */}
        <Route path="/search" element={<SearchResults />} /> {/* Item results */}
        <Route path="/item/:id" element={<ItemDetails />} /> {/* Item details */}
      </Routes>
    </Router>
  );
}

export default App;
