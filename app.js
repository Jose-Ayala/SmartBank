const express = require('express');
const app = express();

// Simple Middleware for Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); 
});

// Middleware
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('SmartBank API is running...');
});

module.exports = app;