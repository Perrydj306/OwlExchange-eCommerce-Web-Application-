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
app.use("/uploads", express.static("uploads"));

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

// USER REGISTRATION 
app.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailDomain = email.split("@")[1];
    const role = emailDomain === "owladmin.com" ? "Admin" : "User";

    await sql.query`
      INSERT INTO Users (username, email, password, role)
      VALUES (${username}, ${email}, ${hashedPassword}, ${role})
    `;
    return res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error adding user:", err);

    const errorNumber =
      err.number ||
      (err.originalError &&
        err.originalError.info &&
        err.originalError.info.number);

    if (errorNumber === 2627) {
      return res
        .status(400)
        .send("Email already registered. Please use another one.");
    }

    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: err.message,
      });
  }
});

// USER LOGIN 
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const result = await sql.query`
      SELECT * FROM Users WHERE email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login");
  }
});

// USER ROUTES
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ITEM ROUTES
app.use("/api/items", require("./routes/itemRoutes"));

// ITEM SEARCH 
app.get("/api/items/search", async (req, res) => {
  const { keyword, category } = req.query;

  try {
    const request = new sql.Request();

    // Add parameters only if provided
    if (keyword) request.input("keyword", sql.VarChar(255), keyword);
    if (category) request.input("category", sql.VarChar(100), category);

    // Base query
    let query = `
      SELECT * FROM Items
      WHERE 1=1
    `;

    // Filter by keyword if provided
    if (keyword && keyword.trim() !== "") {
      query += `
        AND (
          title LIKE CONCAT('%', @keyword, '%')
          OR description LIKE CONCAT('%', @keyword, '%')
          OR category LIKE CONCAT('%', @keyword, '%')
          OR tags LIKE CONCAT('%', @keyword, '%')
        )
      `;
    }

    // Filter by category if provided
    if (category && category.trim() !== "") {
      query += ` AND category = @category `;
    }

    query += ` ORDER BY createdAt DESC`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error searching items:", err);
    res.status(500).json({ error: "Failed to search items" });
  }
});

// START SERVER 
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
