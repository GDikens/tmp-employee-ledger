const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const employeeRoutes = require('./routes/employee.routes');

dotenv.config();

const app = express();

app.use(express.json()); // Middleware to parse JSON

app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});