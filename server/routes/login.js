const express = require("express");
const router = express.Router();
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecret";

// LOGIN ROUTE
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await sql.connect();

    // Check if the user is banned
    const banned = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM BannedUsers WHERE email = @email");

    if (banned.recordset.length > 0) {
      return res
        .status(403)
        .send("Your account has been banned. Please contact the administrator.");
    }

    // Get user
    const userResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (userResult.recordset.length === 0) {
      return res.status(404).send("User not found.");
    }

    const user = userResult.recordset[0];

    // Block inactive users
    if (user.status && user.status.toLowerCase() === "inactive") {
      return res
        .status(403)
        .send("Your account is inactive. Please contact the administrator.");
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid password.");
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error. Please try again later.");
  }
});

module.exports = router; 
