// server.js
const express = require('express');
const connectDB = require('./src/config/db'); // We'll create this next
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Connect Database
connectDB();

// Init Middleware
// This allows us to get data in req.body for POST/PUT requests
app.use(express.json({ extended: false }));
// Enable CORS for all routes, allowing frontend to access backend
app.use(cors());

// Basic route for testing if the server is running
app.get('/', (req, res) => res.send('EcoFinds API is running!'));

// Define Routes (we will add these later)
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/products', require('./src/routes/productRoutes'));

const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));