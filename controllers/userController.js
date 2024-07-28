const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        const user = new User({ name, email, mobile, password: await bcrypt.hash(password, 10) });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};