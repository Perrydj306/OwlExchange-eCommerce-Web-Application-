const express = require("express");
const router = express.Router();
const sql = require("mssql");
const multer = require("multer");
const path = require("path");


// ===== Multer setup for image uploads =====
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ===== Image Upload Route =====
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ===== Add New Item =====
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      price,
      tags,
      contactMethod,
      transactionType,
      imageUrl,
    } = req.body;

    const request = new sql.Request();
    request.input("title", sql.VarChar(255), title);
    request.input("description", sql.VarChar(sql.MAX), description);
    request.input("category", sql.VarChar(100), category);
    request.input("condition", sql.VarChar(50), condition);
    request.input("price", sql.Decimal(10, 2), price || 0);
    request.input("tags", sql.VarChar(255), tags);
    request.input("contactMethod", sql.VarChar(100), contactMethod);
    request.input("transactionType", sql.Int, transactionType);
    request.input("imageUrl", sql.VarChar(500), imageUrl || null);

    await request.query(`
      INSERT INTO Items 
      (title, description, category, condition, price, tags, contactMethod, transactionType, imageUrl, createdAt)
      VALUES 
      (@title, @description, @category, @condition, @price, @tags, @contactMethod, @transactionType, @imageUrl, GETDATE())
    `);

    res.status(201).json({ message: "Item added successfully" });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// ===== Get Total Item Count =====
router.get("/count", async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool
      .request()
      .query("SELECT COUNT(*) AS totalItems FROM Items");

    res.json({ totalItems: result.recordset[0].totalItems });
  } catch (err) {
    console.error("Error counting items:", err);
    res.status(500).json({ error: "Failed to get item count" });
  }
});

// ===== Get All Items =====
router.get("/", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT id, title, description, category, condition, price, tags, contactMethod,
             transactionType, imageUrl, status, createdAt
      FROM Items
      ORDER BY createdAt DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// ===== Search Items =====
router.get("/search", async (req, res) => {
  const { keyword = "", category = "", transactionType = "" } = req.query;

  try {
    let query = `
      SELECT id, title, description, category, condition, price, tags, contactMethod,
             transactionType, imageUrl, status, createdAt
      FROM Items
      WHERE status = 'active'
    `;

    if (keyword) query += ` AND (title LIKE '%${keyword}%' OR description LIKE '%${keyword}%')`;
    if (category && category.toLowerCase() !== "all") query += ` AND LOWER(category) = '${category.toLowerCase()}'`;
    if (transactionType && transactionType !== "All" && transactionType !== "all") query += ` AND transactionType = ${transactionType}`;

    query += " ORDER BY createdAt DESC";

    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

// ===== Get Single Item by ID =====
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query`SELECT * FROM Items WHERE id = ${id}`;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Item not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});


// Approve an item (set status = 'active')
router.put("/:id/approve", async (req, res) => {
  try {
    await sql.query`UPDATE Items SET status = 'active' WHERE id = ${req.params.id}`;
    res.json({ message: "Item approved successfully" });
  } catch (err) {
    console.error("Error approving item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject an item and move it to RejectedItems
router.put("/:id/reject", async (req, res) => {
  const itemId = req.params.id;

  try {
    // Get the item data first
    const result = await sql.query`SELECT * FROM Items WHERE id = ${itemId}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const item = result.recordset[0];

    // Insert it into RejectedItems with status = 'rejected'
    await sql.query`
      INSERT INTO RejectedItems (id, title, category, condition, price, description, status, tags, contactMethod, transactionType, imageUrl, createdAt)
      VALUES (${item.id}, ${item.title}, ${item.category}, ${item.condition}, ${item.price}, ${item.description}, 'rejected', ${item.tags}, ${item.contactMethod}, ${item.transactionType}, ${item.imageUrl}, ${item.createdAt})
    `;

    // Delete it from Items
    await sql.query`DELETE FROM Items WHERE id = ${itemId}`;

    res.json({ message: "Item rejected and moved to RejectedItems" });
  } catch (err) {
    console.error("Error rejecting item:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});





module.exports = router;
