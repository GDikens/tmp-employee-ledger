const pool = require('../data/db');

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users'); // Replace with your table
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};