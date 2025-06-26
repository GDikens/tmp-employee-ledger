const pool = require('../data/db');

// Create a new employee
// POST /api/employees/create
exports.createEmployee = async (req, res) => {
    const { first_name, last_name, name_with_initials, nic, epf_no } = req.body;
    
    if (!first_name || !last_name || !nic || !epf_no) {
        return res.status(400).json({ error: 'first_name, last_name, nic, and epf_no are required' });
    }

    try {
        const query = `INSERT INTO employee (first_name, last_name, name_with_initials, nic, epf_no) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        const values = [first_name, last_name, name_with_initials || null, nic, epf_no];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting employee:', err);

        if (err.code === '23505') {
            // Unique constraint violation (like duplicate NIC)
            return res.status(409).json({ error: 'NIC/EPF No already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all employees
// GET /api/employees/{id}
exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Search Employee by NIC & EPF No
// GET /api/employees/search?nic=1992XXXX&epf_no=123
exports.searchEmployee = async (req, res) => {
    const { nic, epf_no } = req.query;

    if (!nic && !epf_no) {
        return res.status(400).json({ error: 'At least one of nic or epf_no is required' });
    }

    try {
        let query = 'SELECT * FROM employee WHERE';
        const conditions = [];
        const values = [];

        if (nic) {
            values.push(nic);
            conditions.push(`nic = $${values.length}`);
        }

        if (epf_no) {
            values.push(epf_no);
            conditions.push(`epf_no = $${values.length}`);
        }

        query += ' ' + conditions.join(' AND ');

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error searching employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};