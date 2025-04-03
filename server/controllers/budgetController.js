// server/controllers/budgetController.js
const Budget = require('../models/Budget');
const Expense = require('../models/Expense'); // Needed to calculate spending against budget

// Helper function to get start/end dates for common periods
const getPeriodDates = (period, date = new Date()) => {
    let startDate, endDate;
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed

    switch (period) {
        case 'Monthly':
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // End of the month
            break;
        case 'Yearly':
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59, 999); // End of the year
            break;
        case 'Quarterly':
            const quarter = Math.floor(month / 3);
            startDate = new Date(year, quarter * 3, 1);
            endDate = new Date(year, quarter * 3 + 3, 0, 23, 59, 59, 999); // End of the quarter
            break;
        case 'Weekly':
            const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
            const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
            startDate = new Date(date.setDate(diff));
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999); // End of Sunday
            break;
        default: // Handle 'Custom' or fallback - requires dates from request
             startDate = date; // Placeholder
             endDate = date; // Placeholder - custom needs explicit dates
            break;
    }
    return { startDate, endDate };
};


// @desc    Get all budgets for the logged-in user
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).sort({ category: 1 });

        // Optional: Calculate current spending for each budget for the current period
        const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
            let currentSpending = 0;
            let periodDates;

             // Calculate period dates based on budget's start date and period type
            if (budget.period !== 'Custom' || !budget.endDate) {
                // For standard periods, calculate based on *today's* date relevant to the budget period type
                // Or adjust logic: calculate based on the budget's *own* startDate if budgets are fixed per period start
                 periodDates = getPeriodDates(budget.period, budget.startDate); // Use budget's start date context
            } else {
                // Use budget's explicit start/end for Custom
                 periodDates = { startDate: budget.startDate, endDate: budget.endDate };
            }

            // Ensure valid dates before querying
            if (periodDates.startDate && periodDates.endDate) {
                 const expenses = await Expense.find({
                    user: req.user.id,
                    category: budget.category,
                    date: { $gte: periodDates.startDate, $lte: periodDates.endDate }
                });
                currentSpending = expenses.reduce((acc, expense) => acc + expense.amount, 0);
            }


            return {
                ...budget.toObject(), // Convert Mongoose doc to plain object
                currentSpending,
                // Add calculated period dates for clarity if needed
                effectiveStartDate: periodDates?.startDate,
                effectiveEndDate: periodDates?.endDate
            };
        }));


        res.status(200).json({
            success: true,
            count: budgetsWithSpending.length,
            data: budgetsWithSpending,
        });
    } catch (error) {
        console.error('Get Budgets Error:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching budgets' });
    }
};

// @desc    Add a new budget
// @route   POST /api/budgets
// @access  Private
exports.addBudget = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        // Basic validation for overlapping budgets (can be improved)
        // Find existing budget for the same user, category, and period starting on the same day
         let existingBudget;
         if (req.body.period !== 'Custom' && req.body.startDate) {
              const potentialStartDate = new Date(req.body.startDate);
              potentialStartDate.setHours(0,0,0,0); // Normalize start date

              existingBudget = await Budget.findOne({
                  user: req.user.id,
                  category: req.body.category,
                  period: req.body.period,
                  // Check if start date falls within an existing budget's period (more complex check needed for true overlap)
                  // Simple check: Exact match on normalized start date for now
                  startDate: potentialStartDate
              });
         }
         // If adding more complex overlap checks, query for budgets where
         // newStartDate <= existingEndDate AND newEndDate >= existingStartDate

        if (existingBudget) {
             return res.status(400).json({ success: false, message: `Budget for ${req.body.category} for this period starting ${req.body.startDate.split('T')[0]} already exists.` });
        }


        const budget = await Budget.create(req.body);
        res.status(201).json({
            success: true,
            data: budget,
        });
    } catch (error) {
        console.error('Add Budget Error:', error);
         if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
         if (error.code === 11000) { // Handle duplicate key error from index
             return res.status(400).json({ success: false, message: 'Budget for this category and period start date already exists.' });
         }
        res.status(500).json({ success: false, message: 'Server Error adding budget' });
    }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
     try {
        let budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }

        // Make sure user owns the budget
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Prevent changing user, category, period, startDate easily? Or handle overlap checks again?
        // For simplicity, allow updates but warn about potential overlaps if category/period/start date change
         // You might disallow changing category/period/startDate via update, requiring delete/add instead

        budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: budget,
        });
    } catch (error) {
        console.error('Update Budget Error:', error);
         if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Update conflicts with an existing budget for the same category and period start date.' });
         }
        res.status(500).json({ success: false, message: 'Server Error updating budget' });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
     try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await budget.deleteOne();

        res.status(200).json({ success: true, data: {}, message: 'Budget removed' });
    } catch (error) {
        console.error('Delete Budget Error:', error);
        res.status(500).json({ success: false, message: 'Server Error deleting budget' });
    }
};