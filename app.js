const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
