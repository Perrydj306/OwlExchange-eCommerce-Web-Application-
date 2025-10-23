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

// ===== Get All Items =====
router.get("/", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT id, title, description, category, condition, price, tags, contactMethod,
             transactionType, imageUrl, createdAt
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
             transactionType, imageUrl, createdAt
      FROM Items
      WHERE 1=1
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

module.exports = router;
