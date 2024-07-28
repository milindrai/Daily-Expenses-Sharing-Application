const express = require('express');
const router = express.Router();
const { addExpense, getIndividualExpenses, getOverallExpenses, downloadBalanceSheet } = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addExpense);
router.get('/individual', authMiddleware, getIndividualExpenses);
router.get('/overall', authMiddleware, getOverallExpenses);
router.get('/balance-sheet', authMiddleware, downloadBalanceSheet);

module.exports = router;
