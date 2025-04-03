// server/routes/budgetRoutes.js
const express = require('express');
const {
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
} = require('../controllers/budgetController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all budget routes

router.route('/')
    .get(getBudgets)
    .post(addBudget);

router.route('/:id')
    .put(updateBudget)
    .delete(deleteBudget);

module.exports = router;