// client/src/components/budgets/BudgetList.js
import React from 'react';
import BudgetItem from './BudgetItem';
import { motion, AnimatePresence } from 'framer-motion';
import './BudgetList.css';

const BudgetList = ({ budgets, onEdit, onDelete, loading, error }) => {

    if (loading) return <p className="list-message">Loading budgets...</p>;
    if (error) return <p className="list-message error">Error: {error}</p>;
    if (!budgets || budgets.length === 0) return <p className="list-message">No budgets set yet.</p>;

     const listVariants = { visible: { transition: { staggerChildren: 0.1 } }, hidden: {} };

    return (
        <div className="budget-list-container">
            <h3>Your Budgets</h3>
             <motion.ul className="budget-list" variants={listVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                     {budgets.map((budget) => (
                        <BudgetItem
                            key={budget._id} // Important for AnimatePresence
                            budget={budget}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </AnimatePresence>
             </motion.ul>
        </div>
    );
};

export default BudgetList;