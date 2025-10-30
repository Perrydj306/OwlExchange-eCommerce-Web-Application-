const express = require("express");
const router = express.Router();
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecret"; // Move to .env later

// LOGIN ROUTE
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await sql.connect();

    // Check if user is banned
    const banned = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM BannedUsers WHERE email = @email");

    if (banned.recordset.length > 0) {
      return res.status(403).send("Your account has been banned. Please contact the administrator.");
    }

    // Find user
    const userResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (userResult.recordset.length === 0) {
      return res.status(404).send("User not found.");
    }

    const user = userResult.recordset[0];

    // Block inactive accounts
    if (user.status && user.status.toLowerCase() === "inactive") {
      return res.status(403).send("Your account is inactive. Please contact the administrator.");
    }


// CHANGE PASSWORD ROUTE
router.post("/change-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  console.log("Received password change request for user:", userId);

  if (!userId || !newPassword) {
    return res.status(400).json({ error: "User ID and new password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const pool = await sql.connect();
    const request = pool.request();
    request.input("hashedPassword", sql.VarChar(sql.MAX), hashedPassword);
    request.input("userId", sql.Int, userId);

    await request.query(`
      UPDATE Users
      SET password = @hashedPassword, requirePasswordChange = 0
      WHERE id = @userId
    `);

    console.log("✅ Password updated successfully for user:", userId);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ Error updating password:", err.message, err.stack);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

    // Require password change check
    if (user.requirePasswordChange) {
      return res.status(403).json({
        message: "Password change required before login.",
        requireChange: true,
        userId: user.id,
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid password.");
    }

    // Create auth token
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
