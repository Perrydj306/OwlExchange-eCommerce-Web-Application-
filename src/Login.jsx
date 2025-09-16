import React, {useState} from "react";
import { useNavigate } from "react-router-dom"; // Import navigation
import "./Login.css"; // import the css file

export default function Login() {

    const navigate = useNavigate(); // Create navigate function

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

    const handleLogin = (e) => {
        e.preventDefault();

         if(!email || !password) {
        setLoginError("Please fill in all fields")
        return;
    }

    setLoginError("");

    // Admin login
    if(email === "admin@owlexchange.com" && password === "Owlexchangeadmin#01") {
      navigate("/admin"); //Go to AdminPage
      return;
    }

    // Normal user login
    alert(`Login request sent for ${email}`)
    // TODO :Here you would call your backend API to login

    // Normal user login
    navigate("/dashboard"); // Redirect to user Dashboard
    };

    // Handle Register
    const handleRegister = (e) => {
        e.preventDefault();
        if(!firstName || !lastName || !registerEmail || !registerPassword) {
            setRegisterError("Please fill in all fields");
            setRegisterSuccess("");
            return;
        }
        setRegisterError("");
        setRegisterSuccess(`User ${firstName} ${lastName} registered successfully!`);
        setFirstName("");
        setLastName("");
        setRegisterEmail("");
        setRegisterPassword("");
        // Here you would call your backend API to register
    };

    const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage("Please enter your email");
      return;
    }
    setForgotMessage(`If an account exists for ${forgotEmail}, instructions to reset your password have been sent.`);
    setForgotEmail("");
    // Here you would call your backend API to initiate password reset
  };

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
                <button type="submit" className="login-btn">Send Instructions</button>
              </form>
              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  onClick={() => setIsForgot(false)}
                  style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
                >
                  Back to Login
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
                <button type="submit" className="login-btn">Login</button>
              </form>
              <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <button
                  onClick={() => setIsForgot(true)}
                  style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
                >
                  Forgot Password?
                </button>
              </p>
              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
                >
                  New User
                </button>
              </p>
            </>
          )
        ) : (
          <>
            <h2 className="login-title">Register New User</h2>
            {registerError && <p className="error">{registerError}</p>}
            {registerSuccess && <p style={{ color: "green", textAlign: "center" }}>{registerSuccess}</p>}
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
              <button type="submit" className="login-btn">Register</button>
            </form>
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
              >
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}