import React from "react";
import { useNavigate } from "react-router-dom"; // import navigation

export default function AdminPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/"); // redirect back to login page
    };

    return(
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome, Administrator</h1>
            <p>This is the Admin Dashboard for OwlExchange.</p>
            <p>You can manage users, items, and settings here.</p>

            <button
            onClick={handleLogout}
            style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            }}
        >
            Log Out
            </button>
        </div>
    );
}