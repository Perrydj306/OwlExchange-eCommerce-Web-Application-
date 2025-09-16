import React, {useState} from "react";
import "./Login.css"; // import the css file

export default function Login() {

    const [isLogin, setIsLogin] = useState(true);

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

    const handleLogin = (e) => {
        e.preventDefault();

         if(!email || !password) {
        setLoginError("Please fill in all fields")
        return;
    }
    setLoginError("");
    alert(`Logged in as ${email}`)
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
    }

    return (
    <div className="login-container">
      <div className="login-card">
        {isLogin ? (
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