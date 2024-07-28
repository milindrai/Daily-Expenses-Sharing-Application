const express = require('express');
const router = express.Router();
const { createUser, loginUser, logoutUser, getUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/:id', authMiddleware, getUser);

module.exports = router;
