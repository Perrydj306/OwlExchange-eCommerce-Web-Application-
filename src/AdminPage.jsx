import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

export default function AdminPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/");
    };

    return(
        <div className="admin-container">
            <div className="admin-content">
                <h1>Welcome, Administrator</h1>
                <p>This is the Admin Dashboard for OwlExchange.</p>
                <p>You can manage users, items, and settings here.</p>

                <button onClick={handleLogout} className="logout-button">
                    Log Out
                </button>
            </div>
        </div>
    );
}