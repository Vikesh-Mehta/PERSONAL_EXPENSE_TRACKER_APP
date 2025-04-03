// server/models/Expense.js
const mongoose = require('mongoose');

const standardCategories = [
    // Personal
    'Groceries', 'Utilities', 'Rent/Mortgage', 'Transportation', 'Dining Out',
    'Entertainment', 'Healthcare', 'Clothing', 'Personal Care', 'Education',
    'Gifts/Donations', 'Travel', 'Insurance', 'Subscriptions',
    // Family Specific (Examples)
    'Childcare', 'Kids Activities', 'Household Supplies', 'Family Outings',
    // Business Specific (Examples)
    'Office Supplies', 'Software', 'Business Travel', 'Client Meals', 'Marketing',
    // Saving Goals (Can be treated as categories)
    'Emergency Fund', 'Vacation Fund', 'Down Payment',
    // Always have 'Other'
    'Other'
];
// Ensure unique categories
const uniqueCategories = [...new Set(standardCategories)];


const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add a description'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive amount'],
        validate: { validator: v => v > 0, message: 'Amount must be positive.' }
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Please select a category'],
        enum: uniqueCategories // Use the updated, unique list
    },
    date: {
        type: Date,
        default: Date.now,
    },
    notes: { type: String, trim: true },
    vendor: { type: String, trim: true },
    paymentMethod: { type: String, trim: true },

    // --- Fields for Business/Project Tracking ---
    project: { // For Bob the business owner
        type: String,
        trim: true,
    },
    isReimbursable: { // For employee expenses tracked by Bob
        type: Boolean,
        default: false,
    },
    receiptUrl: { // Link to uploaded receipt image/PDF (requires separate upload handling)
        type: String,
        trim: true,
    },
    // --- Field for Family Tracking ---
    // Could add 'member' if multiple family members track under one account,
    // but for David/Emily sharing, 'user' is sufficient. Categories cover most.
    // member: { type: String, trim: true },

}, { timestamps: true });

// Export categories for frontend use
module.exports = mongoose.model('Expense', ExpenseSchema);
module.exports.standardCategories = uniqueCategories;