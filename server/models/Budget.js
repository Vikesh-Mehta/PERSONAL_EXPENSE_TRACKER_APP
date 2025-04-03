// server/models/Budget.js
const mongoose = require('mongoose');
const { standardCategories } = require('./Expense'); // Import categories from Expense model

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: [true, 'Please select a category for the budget'],
        enum: standardCategories, // Use the same categories as expenses for consistency
    },
    amount: {
        type: Number,
        required: [true, 'Please specify the budget amount'],
        min: [0.01, 'Budget amount must be positive'],
    },
    period: { // Defines the budget timeframe
        type: String,
        required: true,
        enum: ['Monthly', 'Yearly', 'Quarterly', 'Weekly', 'Custom'], // Allow flexibility
        default: 'Monthly',
    },
    startDate: { // Start date for the budget period (important for tracking)
        type: Date,
        required: true,
        default: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1) // Default to start of current month
    },
    endDate: { // End date (especially for custom periods, otherwise calculated)
        type: Date,
         // Calculate default based on period if needed, or leave optional for simple monthly/yearly
         // Example for monthly default end date:
         // default: function() { if (this.period === 'Monthly') return new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, 0); }
    },
    // Optional: Add notes for the budget
    notes: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Ensure a user doesn't set multiple budgets for the same category within overlapping periods
// This is complex logic, a simpler approach is unique index per user/category/period-start
// For simplicity here, we might rely on frontend/controller logic to prevent obvious overlaps,
// or enforce uniqueness on user + category + startDate for common periods like 'Monthly'.
BudgetSchema.index({ user: 1, category: 1, startDate: 1, period: 1 }, { unique: true, message: 'Budget for this category and period already exists.' });


module.exports = mongoose.model('Budget', BudgetSchema);