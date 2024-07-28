const mongoose = require('mongoose');
const Expense = require('../models/expense');

const generateBalanceSheet = async () => {
    const expenses = await Expense.find().populate('participants.userId', 'name');
    const balanceSheet = {};
    const overallExpenses = {};

    expenses.forEach(expense => {
        expense.participants.forEach(participant => {
            if (!balanceSheet[participant.userId._id]) {
                balanceSheet[participant.userId._id] = {
                    totalOwed: 0,
                    expenses: []
                };
            }

            balanceSheet[participant.userId._id].totalOwed += participant.amount;
            balanceSheet[participant.userId._id].expenses.push({
                description: expense.description,
                amount: participant.amount,
                createdAt: expense.createdAt
            });

            if (!overallExpenses[participant.userId._id]) {
                overallExpenses[participant.userId._id] = 0;
            }

            overallExpenses[participant.userId._id] += participant.amount;
        });
    });

    return { balanceSheet, overallExpenses };
};

module.exports = generateBalanceSheet;
