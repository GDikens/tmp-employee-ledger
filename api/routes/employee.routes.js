const express = require('express');
const { createEmployee, getEmployeeById, searchEmployee } = require('../controllers/employee.controller');

const router = express.Router();

router.post('/', createEmployee);
router.get('/search', searchEmployee);
router.get('/:id', getEmployeeById);  

module.exports = router;