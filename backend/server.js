const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');
const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const DB_URL = process.env.DB_URL || `mongodb+srv://mstevenson:${process.env.password}@cluster0.evyqiwb.mongodb.net/comp3123_assigment1?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = process.env.PORT || 8081;

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Profile picture

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("<h1>Assignment 2 - User and Employee Management by 101186647</h1>");
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// Connect to the database
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server");    
    app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
