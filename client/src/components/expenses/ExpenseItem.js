// client/src/components/expenses/ExpenseItem.js
import React from 'react';
import { formatCurrencyINR, formatDateReadable } from '../../utils/formatters';
import { motion } from 'framer-motion'; // Import motion
import { FaEdit, FaTrash, FaProjectDiagram, FaReceipt } from 'react-icons/fa'; // Add icons
import './ExpenseItem.css';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {

    // Animation Variants for each item
    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.2 } } // Animate out on delete
    };

    return (
        // Use motion.li and apply variants
        <motion.li
            className="expense-item"
            variants={itemVariants}
            layout // Add layout prop for smooth reordering/exit animations
            initial="hidden" // Start hidden
            animate="visible" // Animate in
            exit="exit"      // Animate out when removed from list
            whileHover={{ scale: 1.02, backgroundColor: "#f8f9fa", transition: {duration: 0.1} }} // Subtle hover
        >
            <div className="expense-item__main">
                <div className="expense-item__date">{formatDateReadable(expense.date)}</div>
                <div className="expense-item__description">
                    {expense.description}
                    {expense.vendor && <span className="expense-item__vendor">({expense.vendor})</span>}
                    {expense.project && (
                        <span className="expense-item__project" title={expense.project}>
                           <FaProjectDiagram /> {/* Project Icon */}
                        </span>
                    )}
                </div>
                 <div className="expense-item__category">{expense.category}</div>
            </div>

            {expense.isReimbursable && <div className="expense-item__reimbursable">Reimbursable</div>}

            <div className="expense-item__amount">{formatCurrencyINR(expense.amount)}</div>

            <div className="expense-item__actions">
                {/* Optional: Add Tooltips or use Icons */}
                {expense.receiptUrl && ( // Show receipt icon if URL exists
                    <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="action-btn receipt-btn" title="View Receipt">
                        <FaReceipt />
                    </a>
                )}
                 <button onClick={() => onEdit(expense)} className="action-btn edit-btn" title="Edit Expense">
                    <FaEdit />
                 </button>
                 <button onClick={() => onDelete(expense._id)} className="action-btn delete-btn" title="Delete Expense">
                    <FaTrash />
                 </button>
            </div>
        </motion.li>
    );
};

export default ExpenseItem;