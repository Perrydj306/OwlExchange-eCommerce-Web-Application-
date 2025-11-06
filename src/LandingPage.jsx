import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // Popup control
  const [showPopup, setShowPopup] = useState(false);
  const [popupKey, setPopupKey] = useState(0); // forces remount to restart CSS animation
  const popupTimerRef = useRef(null);
  const POPUP_MS = 5000; // show for 5 seconds

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [communitySearchTerm, setCommunitySearchTerm] = useState("");

  const triggerPopup = () => {
    // clear any running timer
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);

    // unmount then remount popup to restart animation
    setShowPopup(false);
    // next frame -> remount
    requestAnimationFrame(() => {
      setPopupKey((k) => k + 1);
      setShowPopup(true);
      popupTimerRef.current = setTimeout(() => setShowPopup(false), POPUP_MS);
    });
  };

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCommunitySearchKeyDown = (e) => {
    if (e.key === "Enter" && communitySearchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(communitySearchTerm.trim())}`);
    }
  };

  return (
    <div 
      className="landing-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'linear-gradient(to bottom, #fff, #fff9e6)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">OwlExchange</div>

        {/* Search (locked for guests) */}
        <input
          type="text"
          placeholder="Search donations, trades, sales..."
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={triggerPopup}              // show every click
          onFocus={triggerPopup}              // first focus
          onKeyDown={(e) => {                 // Enter key
            if (e.key === "Enter") {
              e.preventDefault();
              if (searchTerm.trim() !== "") {
                handleSearchKeyDown(e);
              } else {
                triggerPopup();
              }
            }
          }}
        />

        <button className="signin-btn" onClick={() => navigate("/login")}>
          Sign In
        </button>
      </nav>

      {/* Centered Popup */}
      {showPopup && (
        <div className="popup-center" key={popupKey}>
          🔒 Please sign in to search items.
        </div>
      )}

      {/* Hero Section */}
      <header className="hero">
        <h1 style={{ color: '#333' }}>
          Welcome to <span className="highlight">OwlExchange</span>
        </h1>
        <p>
          Your community platform for sharing, trading, and giving. Connect with
          neighbors to donate items, make sustainable swaps, and build a stronger
          local community.
        </p>
        <button className="join-btn" onClick={() => navigate("/login")}>
          Join Our Community
        </button>
      </header>

      {/* Feature Cards */}
      <section className="features">
        <div className="card">
          <span className="card-icon">🎁</span>
          <h3>Donate & Share</h3>
          <p>Give items a second life by donating to community members who need them.</p>
        </div>

        <div className="card">
          <span className="card-icon">🔄</span>
          <h3>Trade & Exchange</h3>
          <p>Swap items you no longer need for things that bring you joy.</p>
        </div>

        <div className="card">
          <span className="card-icon">👥</span>
          <h3>Build Community</h3>
          <p>Connect with neighbors and create lasting relationships through sustainable exchanges.</p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number orange">500+</div>
            <div className="stat-label">Items Shared</div>
          </div>
          <div className="stat-item">
            <div className="stat-number green">200+</div>
            <div className="stat-label">Community Members</div>
          </div>
          <div className="stat-item">
            <div className="stat-number purple">150+</div>
            <div className="stat-label">Successful Trades</div>
          </div>
          <div className="stat-item">
            <div className="stat-number blue">100+</div>
            <div className="stat-label">Free Donations</div>
          </div>
        </div>
      </section>

      {/* Community Exchange */}
      <section className="community-section">
        <h2 className="community-title">Community Exchange</h2>
        <p className="community-description">
          Discover amazing items shared, traded, and sold by your neighbors
        </p>

        <div className="community-search">
          <input
            type="text"
            placeholder="Search items, descriptions, tags..."
            className="community-search-input"
            value={communitySearchTerm}
            onChange={(e) => setCommunitySearchTerm(e.target.value)}
            onClick={triggerPopup}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (communitySearchTerm.trim() !== "") {
                  handleCommunitySearchKeyDown(e);
                } else {
                  triggerPopup();
                }
              }
            }}
          />
          <button className="browse-btn" onClick={() => navigate("/marketplace")}>
            Browse Community Items
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;