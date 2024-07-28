require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const connectDB = require('./config/db'); // Import database connection function
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes'); // Import user routes
const expenseRoutes = require('./routes/expenseRoutes'); // Import expense routes

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

// Use user routes for requests to /api/users
app.use('/api/users', userRoutes);
// Use expense routes for requests to /api/expenses
app.use('/api/expenses', expenseRoutes);

// Start the server
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
