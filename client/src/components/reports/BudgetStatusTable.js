// client/src/components/reports/BudgetStatusTable.js
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrencyINR } from '../../utils/formatters';
import './BudgetStatusTable.css'; // Create this CSS

const BudgetStatusTable = ({ reportData, loading, error }) => {

    if (loading) return <p className="report-message">Loading budget status...</p>;
    if (error) return <p className="report-message error">Error: {error}</p>;
    if (!reportData || reportData.length === 0) return <p className="report-message">No budget data available for this period.</p>;

     const tableVariants = { visible: { transition: { staggerChildren: 0.05 } }, hidden: {} };
     const rowVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

    return (
        <motion.div className="budget-status-table-container">
            <h3>Budget vs. Actual Spending</h3>
            <div className="table-responsive"> {/* Wrapper for scrolling on small screens */}
                <motion.table className="budget-status-table" variants={tableVariants} initial="hidden" animate="visible">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Budgeted</th>
                            <th>Spent</th>
                            <th>Remaining</th>
                            <th>% Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((item) => {
                            const isOver = item.remainingAmount < 0;
                            const percentage = item.percentageSpent;
                            let statusClass = '';
                            if (isOver) statusClass = 'overspent';
                            else if (percentage > 90) statusClass = 'near-limit';
                            else if (percentage > 75) statusClass = 'warning';

                            return (
                                <motion.tr key={item.category} variants={rowVariants} className={statusClass}>
                                    <td>{item.category}</td>
                                    <td>{formatCurrencyINR(item.budgetedAmount)}</td>
                                    <td>{formatCurrencyINR(item.spentAmount)}</td>
                                    <td className={isOver ? 'negative' : 'positive'}>
                                        {formatCurrencyINR(item.remainingAmount)}
                                        {/* {isOver ? ` (${formatCurrencyINR(Math.abs(item.remainingAmount))} Over)` : formatCurrencyINR(item.remainingAmount)} */}
                                    </td>
                                    <td>{percentage > 0 ? `${percentage.toFixed(1)}%` : '0.0%'}</td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </motion.table>
            </div>
        </motion.div>
    );
};

export default BudgetStatusTable;