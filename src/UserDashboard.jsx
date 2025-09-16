import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = () => {
        navigate("/"); // back to login
    };


    return (
        <div style={{ padding: "20px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h1>OwlExchange – User Dashboard</h1>
            <button
            onClick={handleLogout}
            style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
            }}
            >
            Log Out
            </button>
        </header>
        </div>
    );
}