import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reuse your existing login page styling

export default function ChangePassword() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("resetUserId");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Password updated successfully. You can now log in.");
        localStorage.removeItem("resetUserId");
        navigate("/login");
      } else {
        setMessage(data.error || "❌ Failed to change password. Please try again.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage("❌ Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Change Password</h2>
        <p style={{ textAlign: "center", color: "#555", marginBottom: "1rem" }}>
          For your security, please choose a new password before continuing.
        </p>

        {message && (
          <p style={{ color: message.includes("✅") ? "green" : "red", textAlign: "center" }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <button type="submit" className="login-btn">
            Update Password
          </button>
        </form>

        <p className="back-landing-wrapper">
          <button onClick={() => navigate("/login")} className="back-landing-btn">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
