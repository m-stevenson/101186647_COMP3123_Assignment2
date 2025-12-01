const EmployeeModel = require('../models/EmployeeModel');
const express = require('express');
const EmployeeRoutes = express.Router();

const app = express();

// Create a new employee
EmployeeRoutes.post('/employees', async (req, res) => {
    try{
        const newEmployee = new EmployeeModel(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all employees
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
EmployeeRoutes.put('/employees/:id', async (req, res) => {
    try {
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

module.exports = EmployeeRoutes;