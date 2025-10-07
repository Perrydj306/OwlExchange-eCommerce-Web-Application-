const express = require("express");
const router = express.Router();
const sql = require("mssql");

// POST /api/items → Add a new item
router.post("/", async (req, res) => {
  const {
    title,
    description,
    category,
    condition,
    price,
    tags,
    contactMethod,
    transactionType,
  } = req.body;

  //SQL item table
  try {
    const request = new sql.Request();
    request.input("title", sql.VarChar(255), title);
    request.input("description", sql.VarChar(sql.MAX), description);
    request.input("category", sql.VarChar(100), category);
    request.input("condition", sql.VarChar(50), condition);
    request.input("price", sql.Decimal(10, 2), price || 0);
    request.input("tags", sql.VarChar(255), tags);
    request.input("contactMethod", sql.VarChar(100), contactMethod);
    request.input("transactionType", sql.Int, transactionType);

    //insert query
    await request.query(`
      INSERT INTO Items (title, description, category, condition, price, tags, contactMethod, transactionType, createdAt)
      VALUES (@title, @description, @category, @condition, @price, @tags, @contactMethod, @transactionType, GETDATE())
    `);

    res.status(201).json({ message: "Item added successfully" });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// GET /api/items → Fetch all items
router.get("/", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT * FROM Items ORDER BY createdAt DESC
    `);
    res.json(result.recordset); //return array of items
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

module.exports = router;
