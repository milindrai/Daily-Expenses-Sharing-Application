const generateBalanceSheet = (expenses) => {
    const balanceSheet = {};
    const overallExpenses = {};

    expenses.forEach(expense => {
        expense.participants.forEach(participant => {
            const userId = participant.userId.toString();
            const amount = participant.amount || (participant.percentage / 100) * expense.amount;

            if (!balanceSheet[userId]) {
                balanceSheet[userId] = {
                    totalOwed: 0,
                    expenses: [],
                };
            }

            if (!overallExpenses[userId]) {
                overallExpenses[userId] = 0;
            }

            balanceSheet[userId].totalOwed += amount;
            balanceSheet[userId].expenses.push({
                description: expense.description,
                amount,
                createdAt: expense.createdAt,
            });

            overallExpenses[userId] += amount;
        });
    });

    return {
        balanceSheet,
        overallExpenses,
    };
};

module.exports = generateBalanceSheet;
