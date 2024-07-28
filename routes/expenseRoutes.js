const express = require('express');
const { addExpense, getIndividualExpenses, getOverallExpenses, downloadBalanceSheet } = require('../controllers/expenseController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/expenses', auth, addExpense);
router.get('/expenses', auth, getIndividualExpenses);
router.get('/expenses/overall', auth, getOverallExpenses);
router.get('/expenses/balance-sheet', auth, downloadBalanceSheet);

module.exports = router;
