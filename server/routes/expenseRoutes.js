// server/routes/expenseRoutes.js
const express = require('express');
const {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

// Import the protect middleware
const { protect } = require('../middleware/authMiddleware');

// Apply the protect middleware to all routes in this file
router.use(protect);

// Define routes
router.route('/')
    .get(getExpenses)   // GET /api/expenses
    .post(addExpense);  // POST /api/expenses

router.route('/:id')
    .put(updateExpense)     // PUT /api/expenses/:id
    .delete(deleteExpense); // DELETE /api/expenses/:id

module.exports = router;