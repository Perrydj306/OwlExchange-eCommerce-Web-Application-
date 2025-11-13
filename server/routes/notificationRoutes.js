const express = require("express");
const router = express.Router();
const sql = require("mssql");


// CREATE NOTIFICATION (Buyer → Seller)
router.post("/", async (req, res) => {
  const { itemId, sellerId, buyerId, message } = req.body;

  if (!itemId || !sellerId || !buyerId) {
    return res.status(400).json({ error: "itemId, sellerId, buyerId are required" });
  }

  try {
    const pool = await sql.connect();
    await pool.request()
      .input("itemId", sql.Int, itemId)
      .input("sellerId", sql.Int, sellerId)
      .input("buyerId", sql.Int, buyerId)
      .input("message", sql.NVarChar(sql.MAX), message || null)
      .query(`
        INSERT INTO Notifications (itemId, sellerId, buyerId, message, status)
        VALUES (@itemId, @sellerId, @buyerId, @message, 'pending')
      `);

    res.status(201).json({ message: "Notification created" });

  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL NOTIFICATIONS FOR A USER (Buyer + Seller)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await sql.connect();

    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT 
          n.id,
          n.message,
          n.status,
          n.createdAt,
          i.id AS itemId,
          i.title AS itemTitle,
          bu.username AS buyerName,
          s.username AS sellerName
        FROM Notifications n
        JOIN Items i ON n.itemId = i.id
        JOIN Users bu ON n.buyerId = bu.id
        JOIN Users s ON n.sellerId = s.id
        WHERE n.buyerId = @userId OR n.sellerId = @userId
        ORDER BY n.createdAt DESC
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Error fetching combined notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/notifications/count/:userId
router.get("/count/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await sql.connect();

    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT COUNT(*) AS count
        FROM Notifications
        WHERE
          (buyerId = @userId AND buyerRead = 0)
          OR
          (sellerId = @userId AND sellerRead = 0)
      `);

    res.json({ count: result.recordset[0].count });

  } catch (err) {
    console.error("Error fetching notification count:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// MARK ALL AS READ
router.put("/mark-read/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const pool = await sql.connect();

    await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        UPDATE Notifications
        SET 
          buyerRead = CASE WHEN buyerId = @userId THEN 1 ELSE buyerRead END,
          sellerRead = CASE WHEN sellerId = @userId THEN 1 ELSE sellerRead END
        WHERE buyerId = @userId OR sellerId = @userId
      `);

    res.json({ message: "Marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// UPDATE STATUS (Seller → Accept / Decline)
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const pool = await sql.connect();

    // Get original notif info
    const original = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT itemId, sellerId, buyerId 
        FROM Notifications 
        WHERE id = @id
      `);

    if (original.recordset.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const { itemId, sellerId, buyerId } = original.recordset[0];

    // Update the pending notification
    await pool.request()
      .input("id", sql.Int, id)
      .input("status", sql.VarChar(20), status)
      .query(`
        UPDATE Notifications 
        SET status = @status
        WHERE id = @id
      `);

    // Create a NEW notification for the buyer
    const followMessage =
      status === "accepted"
        ? "Your offer was accepted!"
        : "Your offer was declined.";

    await pool.request()
      .input("itemId", sql.Int, itemId)
      .input("sellerId", sql.Int, sellerId)
      .input("buyerId", sql.Int, buyerId)
      .input("message", sql.NVarChar(sql.MAX), followMessage)
      .query(`
        INSERT INTO Notifications (itemId, sellerId, buyerId, message, status)
        VALUES (@itemId, @sellerId, @buyerId, @message, 'info')
      `);

    res.json({ message: "Status updated + notification sent" });

  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
