import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminPage from "./AdminPage";
import UserDashboard from "./UserDashboard";
import LandingPage from "./LandingPage";
import SearchResults from "./SearchResults";
import ItemDetails from "./ItemDetails.jsx";
import ChangePassword from "./ChangePassword";
import ProtectedRoute from "./ProtectedRoute"; 
import Notifications from "./Notifications";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/notifications" element={<Notifications />} />


        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Public item routes */}
        <Route path="/search" element={<SearchResults />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
