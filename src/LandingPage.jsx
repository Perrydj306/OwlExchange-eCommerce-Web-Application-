import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Recommendations from "./Recommendations.jsx";


function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    });
    document.querySelectorAll(".fade-up").forEach(el => fadeObserver.observe(el));

    const counters = document.querySelectorAll(".count");
    counters.forEach(counter => {
      const animate = () => {
        const target = +counter.getAttribute("data-target");
        let start = 0;
        const duration = 1800;
        const startTime = performance.now();
        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(eased * target);
          counter.innerText = value;
          if (progress < 1) requestAnimationFrame(update);
          else {
            counter.innerText = target + "+";
            counter.classList.add("stat-bounce");
            setTimeout(() => counter.classList.remove("stat-bounce"), 500);
          }
        };
        requestAnimationFrame(update);
      };

      const onView = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animate();
            onView.disconnect();
          }
        },
        { threshold: 0 }
      );
      onView.observe(counter);
    });
  }, []);

  return (
    <div className="landing-container">

      <nav className="navbar fade-up">
        <div className="logo">OwlExchange🦉</div>
        <button className="signin-btn" onClick={() => navigate("/login")}>
          Sign In
        </button>
      </nav>

      <header className="hero fade-up">
        <h1>
          Welcome to <span className="highlight">OwlExchange🦉</span>
        </h1>
        <p>
          Your community platform for sharing, trading, and giving.
        </p>
        <button className="join-btn" onClick={() => navigate("/login")}>
          Join Our Community
        </button>
      </header>

      <section className="features fade-up">
        <div className="card fade-up"><span className="card-icon">🎁</span><h3>Donate & Share</h3><p>Give items a second life.</p></div>
        <div className="card fade-up"><span className="card-icon">🔄</span><h3>Trade & Exchange</h3><p>Swap things you don’t need.</p></div>
        <div className="card fade-up"><span className="card-icon">👥</span><h3>Build Community</h3><p>Create meaningful connections.</p></div>
      </section>

      <section className="stats-section fade-up">
        <div className="stats-grid">
          <div className="stat-item fade-up"><div className="stat-number orange count" data-target="500">0</div><div className="stat-label">Items Shared</div></div>
          <div className="stat-item fade-up"><div className="stat-number green count" data-target="200">0</div><div className="stat-label">Community Members</div></div>
          <div className="stat-item fade-up"><div className="stat-number purple count" data-target="150">0</div><div className="stat-label">Successful Trades</div></div>
          <div className="stat-item fade-up"><div className="stat-number blue count" data-target="100">0</div><div className="stat-label">Free Donations</div></div>
        </div>
      </section>

      {/* You Might Like It Section */}
      <Recommendations />


      <div className="owl-zone">
        <div className="owl owl-1"></div>
        <div className="owl owl-2"></div>
        <div className="owl owl-3"></div>
        <div className="owl owl-4"></div>
      </div>

      <section className="community-section fade-up">
        <h2 className="community-title">Community Exchange</h2>
        <p className="community-description">
          Discover amazing items shared by your neighbors.
        </p>
        <div className="community-search" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button className="browse-btn" onClick={() => navigate("/communitysearch")}>
            Browse Community Items
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
