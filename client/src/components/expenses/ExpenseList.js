// client/src/components/expenses/ExpenseList.js
import React from 'react';
import ExpenseItem from './ExpenseItem';
import { AnimatePresence, motion } from 'framer-motion'; // Import AnimatePresence
import './ExpenseList.css';

const ExpenseList = ({ expenses, onEdit, onDelete, loading, error }) => {

    if (loading) { /* ... */ }
    if (error) { /* ... */ }
    if (!expenses || expenses.length === 0) { /* ... */ }

     // Stagger children animation for the list container itself
    const listVariants = {
        visible: {
            transition: {
                staggerChildren: 0.07, // Stagger animation of each child item
            },
        },
         hidden: {}, // No specific transition needed here usually
    };

    return (
        <div className="expense-list-container">
            <h3>Your Expenses</h3>
            {/* Wrap list in motion.ul and AnimatePresence */}
             <motion.ul
                 className="expense-list"
                 variants={listVariants}
                 initial="hidden"
                 animate="visible"
            >
                 <AnimatePresence initial={false}> {/* initial=false prevents initial load animation from AnimatePresence */}
                    {expenses.map((expense) => (
                         // Key is crucial for AnimatePresence to track items
                        <ExpenseItem
                            key={expense._id}
                            expense={expense}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </AnimatePresence>
             </motion.ul>
        </div>
    );
};

export default ExpenseList;