const mongoose = require('mongoose');

// Define the schema for an expense
const ExpenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    
    // Method used to split the expense among participants
    splitMethod: { 
        type: String, 
        enum: ['equal', 'exact', 'percentage'], 
        required: true 
    },
    
    // Array of participants involved in the expense
    participants: [{
        // User ID of the participant
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            index: true // Adding index on userId field in the participants sub-document
        },
        
        // Amount assigned to the participant (used in 'exact' split method)
        amount: { type: Number },
        
        // Percentage assigned to the participant (used in 'percentage' split method)
        percentage: { type: Number },
    }],
    
    // ID of the user who created the expense
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        index: true // Adding index on createdBy field
    },
    
    // Timestamp of when the expense was created
    createdAt: { type: Date, default: Date.now },
});

// Compound index to optimize queries by userId in participants and createdBy
ExpenseSchema.index({ 'participants.userId': 1 });
ExpenseSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
