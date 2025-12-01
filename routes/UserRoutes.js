const UserModel = require('../models/UserModel');
const express = require('express');
const UserRoutes = express.Router();

const app = express();

// Create a new user
UserRoutes.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        if(await UserModel.findOne({ email })) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = await UserModel.create({ username, email, password });
        return res.status(201).json({id: user._id, username: user.username, email: user.email });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User login
UserRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({ message: 'Login successful',  id: user._id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List all users
UserRoutes.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a user by ID
UserRoutes.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = UserRoutes;