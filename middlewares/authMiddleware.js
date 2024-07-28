const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to authenticate users using JWT
const authMiddleware = async (req, res, next) => {
    // Get the token from cookies
    const token = req.cookies.token;
    
    // If no token is provided, return an authorization error
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID from the decoded token and exclude the password field
        req.user = await User.findById(decoded.id).select('-password');

        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
