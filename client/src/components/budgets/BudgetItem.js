// client/src/components/budgets/BudgetItem.js
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrencyINR } from '../../utils/formatters';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './BudgetItem.css';

// Simple progress bar component
const ProgressBar = ({ value, max }) => {
    const percentage = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
    let barColor = 'var(--success-color)'; // Green
    if (percentage > 90) barColor = 'var(--error-color)'; // Red
    else if (percentage > 75) barColor = 'var(--accent-color)'; // Amber/Yellow

    return (
        <div className="progress-bar-container" title={`Spent ${percentage.toFixed(1)}%`}>
            <div
                className="progress-bar-filled"
                style={{ width: `${percentage}%`, backgroundColor: barColor }}
            ></div>
        </div>
    );
};


const BudgetItem = ({ budget, onEdit, onDelete }) => {
    // budget object should include: _id, category, amount, period, startDate, currentSpending
    const remaining = budget.amount - budget.currentSpending;
    const overspent = remaining < 0;

    const itemVariants = {
         hidden: { opacity: 0, x: -30 },
         visible: { opacity: 1, x: 0 },
         exit: { opacity: 0, x: 30 }
    };

    return (
        <motion.li
            className={`budget-item ${overspent ? 'overspent' : ''}`}
            variants={itemVariants}
            layout // Animate layout changes
             whileHover={{ scale: 1.015, zIndex: 1, boxShadow: "var(--shadow-md)" }}
        >
            <div className="budget-item-main">
                <span className="budget-item-category">{budget.category}</span>
                <span className="budget-item-period">({budget.period})</span>
            </div>
            <div className="budget-item-details">
                <span>Budget: {formatCurrencyINR(budget.amount)}</span>
                <span className={`budget-item-spent ${overspent ? 'overspent-text' : ''}`}>
                    Spent: {formatCurrencyINR(budget.currentSpending)}
                </span>
                 <span className={`budget-item-remaining ${overspent ? 'overspent-text' : ''}`}>
                    {overspent ? 'Over:' : 'Left:'} {formatCurrencyINR(Math.abs(remaining))}
                </span>
            </div>
            <div className="budget-item-progress">
                 <ProgressBar value={budget.currentSpending} max={budget.amount} />
             </div>

            <div className="budget-item-actions">
                 <button onClick={() => onEdit(budget)} className="action-btn edit-btn" title="Edit Budget">
                    <FaEdit />
                </button>
                 <button onClick={() => onDelete(budget._id)} className="action-btn delete-btn" title="Delete Budget">
                    <FaTrash />
                </button>
            </div>
        </motion.li>
    );
};

export default BudgetItem;