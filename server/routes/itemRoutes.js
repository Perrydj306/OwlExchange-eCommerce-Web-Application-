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
    request.input("userId", sql.Int, req.body.userId);

   await request.query(`
  INSERT INTO Items 
  (title, description, category, condition, price, tags, contactMethod, transactionType, imageUrl, userId, createdAt)
  VALUES 
  (@title, @description, @category, @condition, @price, @tags, @contactMethod, @transactionType, @imageUrl, @userId, GETDATE())
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

// ===== Get All Items (exclude rejected) =====
router.get("/", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT id, title, description, category, condition, price, tags, contactMethod,
             transactionType, imageUrl, status, createdAt
      FROM Items
      WHERE rejected = 0 OR rejected IS NULL
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


//Get user ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        i.id, i.title, i.description, i.category, i.condition, i.price, 
        i.tags, i.contactMethod, i.transactionType, i.imageUrl, i.status, i.createdAt,
        u.id AS userId, u.username AS sellerName, u.email AS sellerEmail, u.role AS sellerRole, u.created_at AS sellerSince
      FROM Items i
      LEFT JOIN Users u ON i.userId = u.id
      WHERE i.id = @itemId
    `;

    const pool = await sql.connect();
    const result = await pool.request()
      .input("itemId", sql.Int, id)
      .query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching item with seller:", err);
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

  await sql.query`
    UPDATE Items
    SET rejected = 1
    WHERE id = ${item.id}
  `;

    res.json({ message: "Item rejected" });
  } catch (err) {
    console.error("Error rejecting item:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});





module.exports = router;
