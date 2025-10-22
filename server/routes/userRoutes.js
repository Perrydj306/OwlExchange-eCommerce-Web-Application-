const express = require('express');
const router = express.Router();
const sql = require('mssql');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Users`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
