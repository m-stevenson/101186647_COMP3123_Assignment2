const EmployeeModel = require('../models/EmployeeModel');
const express = require('express');
const EmployeeRoutes = express.Router();
const multer = require('multer');
const path = require('path');

const app = express();

// Create a new employee
EmployeeRoutes.post('/employees', upload.single('profile_picture'), async (req, res) => {
    try{

        const employeeData = req.body;

        if (req.file) {
            employeeData.profile_picture = req.file.filename;
        }

        const newEmployee = new EmployeeModel(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all employees
EmployeeRoutes.get('/employees', async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get an employee by ID
EmployeeRoutes.get('/employees/:id', async (req, res) => {
    try {
        const employee = await EmployeeModel.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an employee by ID
EmployeeRoutes.put('/employees/:id', upload.single('profile_picture'), async (req, res) => {
    try {
        const updateData = req.body;

        if (req.file) {
            updateData.profile_picture = req.file.filename;
        }

        updateData.updated_at = Date.now();

        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an employee by ID
EmployeeRoutes.delete('/employees/:id', async (req, res) => {
    try {
        const deletedEmployee = await EmployeeModel.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(204).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search employees by department or position
EmployeeRoutes.get('/employees/search', async (req, res) => {
    try {
        const {department, position} = req.query;

        const filter = {};
        if (department) {
            filter.department = department;
        }
        if (position) {
            filter.position = position;
        }

        const employees = await EmployeeModel.find(filter);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handle upload of profile picture
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = EmployeeRoutes;