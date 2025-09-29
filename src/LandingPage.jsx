import React from 'react';
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

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
        
        <input
          type="text"
          placeholder="Search donations, trades, sales..."
          className="search"
        />
        
        <button
          className="signin-btn"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </nav>

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
        <button
          className="join-btn"
          onClick={() => navigate("/login")}
        >
          Join Our Community
        </button>
      </header>

      {/* Feature Cards */}
      <section className="features">
        <div className="card">
          <span className="card-icon">🎁</span>
          <h3>Donate & Share</h3>
          <p>
            Give items a second life by donating to community members who need them.
          </p>
        </div>

        <div className="card">
          <span className="card-icon">🔄</span>
          <h3>Trade & Exchange</h3>
          <p>
            Swap items you no longer need for things that bring you joy.
          </p>
        </div>

        <div className="card">
          <span className="card-icon">👥</span>
          <h3>Build Community</h3>
          <p>
            Connect with neighbors and create lasting relationships through sustainable exchanges.
          </p>
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

      {/* Community Exchange Section */}
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
          />
          
          <button
            className="browse-btn"
            onClick={() => navigate("/marketplace")}
          >
            Browse Community Items
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;