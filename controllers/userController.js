const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controller to handle user registration
exports.createUser = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        // Hash the password and create a new user
        const user = new User({
            name,
            email,
            mobile,
            password: await bcrypt.hash(password, 10)
        });

        // Save the user to the database
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ error: error.message });
    }
};

// Controller to handle user login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in a cookie
        res.cookie('token', token, { httpOnly: true }).status(200).json(user);
    } catch (err) {
        // Handle any server errors
        res.status(500).json({ error: err.message });
    }
};

// Controller to handle user logout
exports.logoutUser = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

// Controller to get user details by id
exports.getUser = async (req, res) => {
    try {
        // Find the user by id
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ error: error.message });
    }
};
