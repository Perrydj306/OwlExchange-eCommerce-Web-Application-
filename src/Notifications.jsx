import React, { useEffect, useState } from "react";
import "./Notifications.css";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch notifications + mark them read
  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      const res = await fetch(
        `http://localhost:5000/api/notifications/user/${user.id}`
      );
      const data = await res.json();
      setNotifications(data);

      // Mark notifications as read
      await fetch(
        `http://localhost:5000/api/notifications/mark-read/${user.id}`,
        { method: "PUT" }
      );
    };

    loadNotifications();
  }, []);

  const handleAccept = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    });
    window.location.reload();
  };

  const handleDecline = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "declined" }),
    });
    window.location.reload();
  };

  const isBuyer = (notif) => notif.buyerName === user.username;
  const isSeller = (notif) => notif.sellerName === user.username;

  return (
    <div className="notif-page">
      <h1 className="notif-title">Notifications🦉</h1>

      <button className="notif-back" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {notifications.length === 0 ? (
        <p className="no-notifs">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="notif-card">
            <div className="notif-header">
              {isSeller(n) && n.status === "pending" && (
                <>
                  <strong>{n.buyerName}</strong> is interested in{" "}
                  <span className="notif-item">{n.itemTitle}</span>
                </>
              )}

              {isBuyer(n) && n.status === "accepted" && (
                <span className="notif-item">
                  ✔ Your offer for <strong>{n.itemTitle}</strong> was accepted!
                </span>
              )}

              {isBuyer(n) && n.status === "declined" && (
                <span className="notif-item">
                  ✖ Your offer for <strong>{n.itemTitle}</strong> was declined.
                </span>
              )}

              {isBuyer(n) && n.status === "info" && (
                <span className="notif-item">
                  ℹ Update for <strong>{n.itemTitle}</strong>
                </span>
              )}
            </div>

            <p className="notif-message">
              <strong>Message:</strong> {n.message}
            </p>

            <span className={`notif-status ${n.status}`}>
              {n.status.toUpperCase()}
            </span>

            <div className="notif-buttons">
              {isSeller(n) && n.status === "pending" && (
                <>
                  <button className="btn-accept" onClick={() => handleAccept(n.id)}>
                    ACCEPT
                  </button>
                  <button className="btn-decline" onClick={() => handleDecline(n.id)}>
                    DECLINE
                  </button>
                </>
              )}

              <button
                className="btn-view"
                onClick={() => navigate(`/item/${n.itemId}`)}
              >
                VIEW ITEM
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
