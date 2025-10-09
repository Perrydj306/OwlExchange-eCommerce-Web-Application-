import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  //  Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoginError("");

        if (data.user.email === "admin@owlexchange.com") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        const errMsg = await res.text();
        setLoginError(errMsg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Server error. Please try again later.");
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !registerEmail || !registerPassword) {
      setRegisterError("Please fill in all fields");
      setRegisterSuccess("");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: `${firstName} ${lastName}`,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (res.ok) {
        setRegisterError("");
        setRegisterSuccess(`User ${firstName} ${lastName} registered successfully!`);
        setFirstName("");
        setLastName("");
        setRegisterEmail("");
        setRegisterPassword("");
      } else {
        const errMsg = await res.text();
        setRegisterError(errMsg || "Unknown error");
        setRegisterSuccess("");
      }
    } catch (err) {
      console.error("Register error:", err);
      setRegisterError("Network/Server error. Please try again later.");
    }
  };

  // Forgot Password (placeholder for now)
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage("Please enter your email");
      return;
    }
    setForgotMessage(
      `If an account exists for ${forgotEmail}, instructions to reset your password have been sent.`
    );
    setForgotEmail("");
  };

  // Main Return
  return (
    <div className="login-container">
      <div className="login-card">
        {isLogin ? (
          isForgot ? (
            <>
              <h2 className="login-title">Forgot Password</h2>
              {forgotMessage && (
                <p style={{ color: "green", textAlign: "center" }}>{forgotMessage}</p>
              )}
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <button type="submit" className="login-btn">
                  Send Instructions
                </button>
              </form>
              <p className="back-landing-wrapper">
                <button onClick={() => setIsForgot(false)} className="back-landing-btn">
                  Back to Login
                </button>
              </p>
              <p className="back-landing-wrapper">
                <button onClick={() => navigate("/")} className="back-landing-btn">
                  Back to Home
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="login-title">OwlExchange</h2>
              {loginError && <p className="error">{loginError}</p>}
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" className="login-btn">
                  Login
                </button>
              </form>
              <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <button
                  onClick={() => setIsForgot(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    cursor: "pointer",
                  }}
                >
                  Forgot Password?
                </button>
              </p>
              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    cursor: "pointer",
                  }}
                >
                  New User
                </button>
              </p>
              <p className="back-landing-wrapper">
                <button onClick={() => navigate("/")} className="back-landing-btn">
                  Back to Home
                </button>
              </p>
            </>
          )
        ) : (
          <>
            <h2 className="login-title">Register New User</h2>
            {registerError && <p className="error">{registerError}</p>}
            {registerSuccess && (
              <p style={{ color: "green", textAlign: "center" }}>{registerSuccess}</p>
            )}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="login-btn">
                Register
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                }}
              >
                Login here
              </button>
            </p>
            <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Back to Home
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}