const express = require("express");
const router = express.Router();
const sql = require("mssql");

// GET all active users (not admins)
router.get("/", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Users WHERE role = 'User'`;
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

// Ban a user: move to BannedUsers and remove from Users
router.delete("/:id/ban", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect();

    // Copy user into BannedUsers table first, then remove from Users
    const query = `
      BEGIN TRANSACTION;
        INSERT INTO BannedUsers (original_user_id, username, email, password, created_at, role, status)
        SELECT id, username, email, password, created_at, role, status
        FROM Users
        WHERE id = @id;

        DELETE FROM Users WHERE id = @id;
      COMMIT TRANSACTION;
    `;

    await pool.request().input("id", sql.Int, id).query(query);

    res.status(200).json({ message: "User banned successfully" });
  } catch (err) {
    console.error("Error banning user:", err);
    res.status(500).json({ error: "Failed to ban user" });
  }
});

// RESTORE banned user
router.post("/:id/restore", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query(`
      INSERT INTO Users (username, email, password, created_at, role, status)
      SELECT username, email, password, created_at, role, 'Inactive'
      FROM BannedUsers WHERE id = ${id};

      DELETE FROM BannedUsers WHERE id = ${id};
    `);

    res.json({ message: "User restored successfully" });
  } catch (err) {
    console.error("Error restoring user:", err);
    res.status(500).json({ error: "Failed to restore user" });
  }
});

module.exports = router;

