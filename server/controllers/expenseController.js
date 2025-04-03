// server/controllers/expenseController.js
const Expense = require('../models/Expense');
const User = require('../models/User'); // Might need if creating related data
const { checkBudgetNotifications } = require('./reportController');

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res, next) => {
    try {
        // Find expenses belonging to the logged-in user (req.user is added by protect middleware)
        // Sort by date descending (most recent first)
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses,
        });
    } catch (error) {
        console.error('Get Expenses Error:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching expenses' });
    }
};

exports.addExpense = async (req, res, next) => {
  try {
      req.body.user = req.user.id;
      const expense = await Expense.create(req.body);

      // --- Check Notifications After Adding ---
      await checkBudgetNotifications(req.user.id, expense);
      // --------------------------------------

      res.status(201).json({
          success: true,
          data: expense,
      });
  } catch (error) { // ... (error handling)
      console.error('Add Expense Error:', error);
      if (error.name === 'ValidationError') { /* ... */ }
      res.status(500).json({ success: false, message: 'Server Error adding expense' });
  }
};

// @desc    Add a new expense for the logged-in user
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res, next) => {
    try {
        // Add user ID from the protect middleware to the request body
        req.body.user = req.user.id;

        // Create the expense in the database
        const expense = await Expense.create(req.body);

        res.status(201).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        console.error('Add Expense Error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'Server Error adding expense' });
    }
};

exports.updateExpense = async (req, res, next) => {
  try {
      let expense = await Expense.findById(req.params.id);
      if (!expense) { /* ... */ }
      if (expense.user.toString() !== req.user.id) { /* ... */ }

      const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
          new: true, runValidators: true,
      });

      // --- Check Notifications After Updating ---
      // Check only if amount or category potentially changed
      if (req.body.amount || req.body.category || req.body.date) {
           await checkBudgetNotifications(req.user.id, updatedExpense);
      }
      // -----------------------------------------

      res.status(200).json({
          success: true,
          data: updatedExpense,
      });
  } catch (error) { // ... (error handling)
      console.error('Update Expense Error:', error);
      if (error.name === 'ValidationError') { /* ... */ }
      res.status(500).json({ success: false, message: 'Server Error updating expense' });
  }
};


// @desc    Update an existing expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res, next) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Make sure user owns the expense
        // req.user.id comes from the token (protect middleware)
        // expense.user is the ObjectId stored in the expense document
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this expense' });
        }

        // Update the expense fields
        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document
            runValidators: true, // Run mongoose validation on update
        });

        res.status(200).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        console.error('Update Expense Error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ success: false, message: 'Expense not found with that ID' });
        }
        res.status(500).json({ success: false, message: 'Server Error updating expense' });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // Make sure user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this expense' });
        }

        await expense.deleteOne(); // Use deleteOne() on the document

        res.status(200).json({
            success: true,
            data: {}, // Indicate successful deletion
            message: 'Expense removed'
        });
    } catch (error) {
        console.error('Delete Expense Error:', error);
         if (error.kind === 'ObjectId') {
             return res.status(404).json({ success: false, message: 'Expense not found with that ID' });
        }
        res.status(500).json({ success: false, message: 'Server Error deleting expense' });
    }
};