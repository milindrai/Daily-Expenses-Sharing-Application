const Expense = require('../models/expense');
const generateBalanceSheet = require('../utils/balanceSheet');

// Controller to handle adding a new expense
exports.addExpense = async (req, res) => {
    const { description, amount, splitMethod, participants } = req.body;

    try {
        let calculatedParticipants = [];

        // Handle equal split method
        if (splitMethod === 'equal') {
            const splitAmount = amount / participants.length;
            calculatedParticipants = participants.map(participant => ({
                userId: participant.userId,
                amount: splitAmount
            }));
        } 
        // Handle exact split method
        else if (splitMethod === 'exact') {
            const totalExactAmount = participants.reduce((sum, participant) => sum + participant.amount, 0);

            // Check if total specified amounts match the expense amount
            if (totalExactAmount !== amount) {
                return res.status(400).json({ error: 'Total of specified amounts must equal the expense amount' });
            }

            calculatedParticipants = participants;
        } 
        // Handle percentage split method
        else if (splitMethod === 'percentage') {
            const totalPercentage = participants.reduce((sum, participant) => sum + participant.percentage, 0);

            // Check if total percentage is 100%
            if (totalPercentage !== 100) {
                return res.status(400).json({ error: 'Total percentage must be 100' });
            }

            calculatedParticipants = participants.map(participant => ({
                userId: participant.userId,
                amount: amount * (participant.percentage / 100)
            }));
        }

        // Create a new expense document
        const expense = new Expense({
            description,
            amount,
            splitMethod,
            participants: calculatedParticipants,
            createdBy: req.user.id
        });

        // Save the expense to the db
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ error: error.message });
    }
};

// Controller to get individual expense for the logged-in user
exports.getIndividualExpenses = async (req, res) => {
    try {
        // Fetching expenses where the logged-in user is a participant
        const expenses = await Expense.find({ 'participants.userId': req.user.id });
        
        // Calculate the total amount spent by the user
        const totalAmountSpent = expenses.reduce((total, expense) => {
            const participant = expense.participants.find(p => p.userId.toString() === req.user.id);
            return total + (participant ? participant.amount : 0);
        }, 0);

        // Sending the fetched expenses and total amount spent as a JSON response
        res.status(200).json({ expenses, totalAmountSpent });
    } catch (error) {
        // Handling any server errors
        res.status(500).json({ error: error.message });
    }
};

// Controller to get overall expenses
exports.getOverallExpenses = async (req, res) => {
    try {
        // Fetch all expenses from the database
        const expenses = await Expense.find({});
        
        // Calculate the total amount spent across all expenses
        const totalAmountSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

        // Sending the fetched expenses and total amount spent as a JSON response
        res.status(200).json({ expenses, totalAmountSpent });
    } catch (error) {
        // Handling any server errors
        res.status(500).json({ error: error.message });
    }
};

// Controller to download the balance sheet
exports.downloadBalanceSheet = async (req, res) => {
    try {
        const balanceSheet = await generateBalanceSheet();
        res.status(200).json(balanceSheet);
    } catch (error) {
        // Handle any server errors
        res.status(500).json({ error: error.message });
    }
};
