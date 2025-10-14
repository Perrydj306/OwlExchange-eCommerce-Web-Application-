const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // import the db connection
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecret"; // move to .env for production

console.log("Starting backend...");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MSSQL
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to OWL EXCHANGE!");
});

// Test route
app.get("/api/test", (req, res) => {
  res.send("Backend is working!");
});

// Register new user
app.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role based on email domain
    const emailDomain = email.split("@")[1];
    const role = emailDomain === "owladmin.com" ? "Admin" : "User";

    await sql.query`
      INSERT INTO Users (username, email, password, role)
      VALUES (${username}, ${email}, ${hashedPassword}, ${role})
    `;
    return res.status(201).send("User created successfully");
  }
   catch (err) {
    console.error("Error adding user:", err);

  // Check both top-level and nested error numbers
  const errorNumber = err.number || (err.originalError && err.originalError.info && err.originalError.info.number);

  if (errorNumber === 2627) {
    return res.status(400).send("Email already registered. Please use another one.");
  }

  console.error("Registration error:", err);
  res.status(500).json({ message: "Server error during registration", error: err.message });
}

});


// Login user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    // Find user by email
    const result = await sql.query`
      SELECT * FROM Users WHERE email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const user = result.recordset[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Generate JWT (authenthication token)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login");
  }
});

//Connecting to item route integration
app.use("/api/items", require("./routes/itemRoutes"));

//start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


