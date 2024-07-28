const express = require('express');
const { createUser, getUserDetails } = require('../controllers/userController');
const router = express.Router();

router.post('/users', createUser);
router.get('/users/:id', getUserDetails);

module.exports = router;
