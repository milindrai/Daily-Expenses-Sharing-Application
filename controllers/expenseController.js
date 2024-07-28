const Expense = require('../models/expense');
const generateBalanceSheet = require('../utils/balanceSheet');

exports.addExpense = async (req, res) => {
    const { description, amount, splitMethod, participants } = req.body;
    try {
        let calculatedParticipants = [];

        if (splitMethod === 'equal') {
            const splitAmount = amount / participants.length;
            calculatedParticipants = participants.map(participant => ({
                userId: participant.userId,
                amount: splitAmount
            }));
        } else if (splitMethod === 'exact') {
            calculatedParticipants = participants;
        } else if (splitMethod === 'percentage') {
            calculatedParticipants = participants.map(participant => ({
                userId: participant.userId,
                amount: amount * (participant.percentage / 100)
            }));
        }

        const expense = new Expense({
            description,
            amount,
            splitMethod,
            participants: calculatedParticipants,
            createdBy: req.user.id
        });

        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getIndividualExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ 'participants.userId': req.user.id });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOverallExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({});
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.downloadBalanceSheet = async (req, res) => {
    try {
        const balanceSheet = await generateBalanceSheet();
        res.status(200).json(balanceSheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
