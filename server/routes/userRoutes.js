const express = require("express");
const router = express.Router();
const sql = require("mssql");
const bcrypt = require("bcryptjs");


// GET all active users (not admins)
router.get("/", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Users WHERE role = 'User' AND (banned = 0 OR banned IS NULL)`;
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// TOGGLE user active/inactive
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`SELECT status FROM Users WHERE id = ${id}`;
    const user = result.recordset[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    await sql.query`UPDATE Users SET status = ${newStatus} WHERE id = ${id}`;

    res.json({ message: "Status updated", newStatus });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

// Ban a user: set banned = 1 (True)
router.post("/:id/ban", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE Users
        SET banned = 1
        WHERE id = @id
      `);

    res.status(200).json({ message: "User banned successfully" });
  } catch (err) {
    console.error("Error banning user:", err);
    res.status(500).json({ error: "Failed to ban user" });
  }
});

// Restore a banned user: set banned = 0 (False)
router.post("/:id/restore", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect();
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE Users
        SET banned = 0
        WHERE id = @id
      `);

    res.json({ message: "User restored successfully" });
  } catch (err) {
    console.error("Error restoring user:", err);
    res.status(500).json({ error: "Failed to restore user" });
  }
});


// RESET a user's password (for recovery)
router.put("/:id/reset-password", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).json({ error: "New password required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const request = new sql.Request();
    request.input("hashedPassword", sql.VarChar(sql.MAX), hashedPassword);
    request.input("userId", sql.Int, id);

await request.query(`
  UPDATE Users 
  SET password = @hashedPassword, requirePasswordChange = 1
  WHERE id = @userId
`);


    res.json({
      message: "Password reset successfully. User must change it on next login.",
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// CHANGE PASSWORD ROUTE
router.post("/change-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  console.log("Received password change request for user:", userId);

  try {
    if (!userId || !newPassword) {
      return res.status(400).json({ error: "User ID and new password required." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const request = new sql.Request();
      request.input("hashedPassword", sql.VarChar(sql.MAX), hashedPassword);
      request.input("userId", sql.Int, userId);

    await request.query(`
      UPDATE Users 
      SET password = @hashedPassword, requirePasswordChange = 0
      WHERE id = @userId
    `);

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Failed to update password." });
  }
});

module.exports = router;

