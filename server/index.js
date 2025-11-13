const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const notificationRoutes = require("./routes/notificationRoutes");

const SECRET_KEY = "supersecret"; // move to .env for production

console.log("Starting backend...");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", notificationRoutes);

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

    const account_type = role === "User" ? "Buyer" : null;

    await sql.query`
      INSERT INTO Users (username, email, password, role, account_type, status)
      VALUES (${username}, ${email}, ${hashedPassword}, ${role}, ${account_type}, 'Active')
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

    res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    });
  }
});

// LOGIN ROUTE (External)
const loginRoute = require("./routes/login");
app.use("/api/login", loginRoute);

// USER ROUTES
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// ITEM ROUTES
const itemRoutes = require("./routes/itemRoutes");
app.use("/api/items", itemRoutes);

// ITEM SEARCH
app.get("/api/items/search", async (req, res) => {
  const { keyword, category } = req.query;

  try {
    const request = new sql.Request();

    if (keyword) request.input("keyword", sql.VarChar(255), keyword);
    if (category) request.input("category", sql.VarChar(100), category);

    let query = `
      SELECT * FROM Items
      WHERE 1=1
    `;

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
