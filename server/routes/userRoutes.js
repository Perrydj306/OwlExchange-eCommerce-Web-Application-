const express = require('express');
const router = express.Router();
const sql = require('mssql');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Users WHERE role = 'User'`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Toggle user active/suspended status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;

  try {
    // Get the current status
    const result = await sql.query`SELECT status FROM Users WHERE id = ${id}`;
    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Flip it
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';

    // Update the database
    await sql.query`UPDATE Users SET status = ${newStatus} WHERE id = ${id}`;

    res.json({ message: 'Status updated', newStatus });
  } catch (err) {
    console.error('Error updating user status:', err);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

module.exports = router;
