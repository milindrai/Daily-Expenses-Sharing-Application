const express = require('express');
const router = express.Router();
const { addExpense, getIndividualExpenses, getOverallExpenses, downloadBalanceSheet } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addExpense);
router.get('/', authMiddleware, getIndividualExpenses);
router.get('/overall', authMiddleware, getOverallExpenses);
router.get('/balance-sheet', authMiddleware, downloadBalanceSheet);

module.exports = router;
