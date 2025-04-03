// server/routes/reportRoutes.js
const express = require('express');
const {
    getSpendingByCategory,
    getBudgetStatusReport
} = require('../controllers/reportController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all report routes

// Example route: /api/reports/category-summary?period=Monthly&date=2023-10-26
router.get('/category-summary', getSpendingByCategory);

// Example route: /api/reports/budget-status?period=Monthly
router.get('/budget-status', getBudgetStatusReport);

// Add more report routes here (e.g., spending over time)

module.exports = router;