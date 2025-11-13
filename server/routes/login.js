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

    // Find user
    const userResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (userResult.recordset.length === 0) {
      return res.status(404).send("User not found.");
    }

    const user = userResult.recordset[0];

    if (user.banned === 1 || user.banned === true) {
      return res.status(403).send("Your account has been banned. Please contact support.");
    }

    // Handle NULL or inactive status safely
    if (!user.status || user.status.toLowerCase() === "inactive") {
      return res
        .status(403)
        .send("Your account has been deactivated. Please contact the administrator.");
    }

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
        banned: user.banned,
        account_type: user.account_type,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error. Please try again later.");
  }
});

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
    await pool
      .request()
      .input("hashedPassword", sql.VarChar(sql.MAX), hashedPassword)
      .input("userId", sql.Int, userId)
      .query(`
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

module.exports = router;
