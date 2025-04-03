// server/controllers/reportController.js
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Helper function from budgetController (or move to a shared utils file)
const getPeriodDates = (period, date = new Date()) => {
    let startDate, endDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    switch (period) { /* ... (include the full function from budgetController) ... */
        case 'Monthly': startDate = new Date(year, month, 1); endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); break;
        case 'Yearly': startDate = new Date(year, 0, 1); endDate = new Date(year, 11, 31, 23, 59, 59, 999); break;
        // Add other cases: Quarterly, Weekly
        default: startDate = new Date(year, month, 1); endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // Default Monthly
    }
    return { startDate, endDate };
};


// @desc    Get spending summary by category for a given period
// @route   GET /api/reports/category-summary?period=Monthly&date=YYYY-MM-DD
// @access  Private
exports.getSpendingByCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const period = req.query.period || 'Monthly'; // Default to Monthly
        const dateParam = req.query.date ? new Date(req.query.date) : new Date(); // Use provided date or today
        if (isNaN(dateParam)) {
            return res.status(400).json({ success: false, message: 'Invalid date parameter.' });
        }

        const { startDate, endDate } = getPeriodDates(period, dateParam);

        if (!startDate || !endDate) {
             return res.status(400).json({ success: false, message: 'Invalid period specified.' });
        }

        const categorySummary = await Expense.aggregate([
            {
                $match: { // Filter expenses
                    user: new mongoose.Types.ObjectId(userId), // Match user ID
                    date: { $gte: startDate, $lte: endDate } // Within the date range
                }
            },
            {
                $group: { // Group by category
                    _id: '$category', // Grouping key
                    totalAmount: { $sum: '$amount' } // Sum amounts for each category
                }
            },
            {
                $sort: { totalAmount: -1 } // Sort by total amount descending
            },
            {
                $project: { // Reshape the output
                    _id: 0, // Exclude the default _id
                    category: '$_id', // Rename _id to category
                    totalAmount: 1 // Include totalAmount
                }
            }
        ]);

        res.status(200).json({
            success: true,
            period: period,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            data: categorySummary
        });

    } catch (error) {
        console.error('Category Summary Report Error:', error);
        res.status(500).json({ success: false, message: 'Server Error generating category summary' });
    }
};


// @desc    Get budget vs actual spending report for a given period
// @route   GET /api/reports/budget-status?period=Monthly&date=YYYY-MM-DD
// @access  Private
exports.getBudgetStatusReport = async (req, res, next) => {
     try {
        const userId = req.user.id;
        const period = req.query.period || 'Monthly';
        const dateParam = req.query.date ? new Date(req.query.date) : new Date();
         if (isNaN(dateParam)) {
            return res.status(400).json({ success: false, message: 'Invalid date parameter.' });
        }

        const { startDate, endDate } = getPeriodDates(period, dateParam);
         if (!startDate || !endDate) {
             return res.status(400).json({ success: false, message: 'Invalid period specified.' });
        }

        // 1. Get budgets relevant to the period (simplified: find budgets with matching period type for now)
        //    A more accurate query would find budgets whose [startDate, endDate] overlaps with the report's [startDate, endDate]
        const budgets = await Budget.find({
            user: userId,
            period: period, // Simple match by period type
             // Add date overlap check if needed: e.g., startDate: { $lte: reportEndDate }, endDate: { $gte: reportStartDate }
        }).lean(); // Use .lean() for plain JS objects

        // 2. Get actual spending grouped by category for the period
         const actualSpending = await Expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
            { $project: { _id: 0, category: '$_id', totalAmount: 1 } }
        ]);

        // 3. Combine Budget and Actual Spending Data
        const reportData = budgets.map(budget => {
            const actual = actualSpending.find(spend => spend.category === budget.category);
            const spentAmount = actual ? actual.totalAmount : 0;
            const remaining = budget.amount - spentAmount;
            const percentageSpent = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

            return {
                category: budget.category,
                budgetedAmount: budget.amount,
                spentAmount: spentAmount,
                remainingAmount: remaining,
                percentageSpent: parseFloat(percentageSpent.toFixed(2)) // Format to 2 decimal places
            };
        });

         // Optional: Add categories with spending but no budget
         actualSpending.forEach(actual => {
             if (!reportData.some(item => item.category === actual.category)) {
                 reportData.push({
                     category: actual.category,
                     budgetedAmount: 0,
                     spentAmount: actual.totalAmount,
                     remainingAmount: -actual.totalAmount, // Negative remaining
                      percentageSpent: Infinity // Or handle differently
                 });
             }
         });


        res.status(200).json({
            success: true,
            period: period,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            data: reportData,
        });

    } catch (error) {
        console.error('Budget Status Report Error:', error);
        res.status(500).json({ success: false, message: 'Server Error generating budget status report' });
    }
};

// --- Placeholder for Notification Logic ---
// This would likely live in the expenseController or a dedicated notification service
exports.checkBudgetNotifications = async (userId, expense) => {
    // This is called *after* an expense is added/updated
    console.log(`Checking budget notifications for user ${userId} after expense:`, expense.description);
    try {
        const periodDates = getPeriodDates('Monthly', expense.date); // Check against monthly budget for simplicity

        const budget = await Budget.findOne({
            user: userId,
            category: expense.category,
            period: 'Monthly', // Assuming monthly check for now
             startDate: { $lte: expense.date }, // Budget started before or on expense date
             // Add endDate check if applicable
        });

        if (!budget) {
            // console.log(`No budget found for category ${expense.category} in the relevant period.`);
            return; // No budget set for this category/period
        }

        // Calculate total spending for this category in the budget period
        const expenses = await Expense.find({
            user: userId,
            category: expense.category,
            date: { $gte: periodDates.startDate, $lte: periodDates.endDate }
        });
        const currentSpending = expenses.reduce((acc, item) => acc + item.amount, 0);

        const eightyPercent = budget.amount * 0.8;
        const oneHundredPercent = budget.amount;

        let notificationMessage = null;

        // Check thresholds (ensure we don't notify repeatedly for the same threshold breach)
        // TODO: Need a mechanism to track *if* a notification for 80% or 100% was already sent for this budget/period
        if (currentSpending >= oneHundredPercent) {
            notificationMessage = `Budget Alert: You have exceeded your ${budget.period} budget of ₹${budget.amount.toFixed(2)} for ${budget.category}. Current spending: ₹${currentSpending.toFixed(2)}.`;
        } else if (currentSpending >= eightyPercent) {
            notificationMessage = `Budget Warning: You have spent ₹${currentSpending.toFixed(2)} (≥80%) of your ${budget.period} budget (₹${budget.amount.toFixed(2)}) for ${budget.category}.`;
        }

        if (notificationMessage) {
            console.log("NOTIFICATION TO USER:", userId, notificationMessage);
            // --- Integration Point ---
            // Here you would:
            // 1. Save this notification to a Notification collection in the DB.
            // 2. If using WebSockets/SSE, push this message to the connected client.
            // 3. If not real-time, the user will fetch it later via a notification endpoint.
            // Example: await Notification.create({ user: userId, message: notificationMessage, type: 'budget' });
        }

    } catch (error) {
        console.error("Error checking budget notifications:", error);
    }
};