// client/src/components/expenses/ExpenseItem.js
import React from 'react';
import './ExpenseItem.css'; // Create this CSS file
import { formatCurrencyINR, formatDateReadable } from '../../utils/formatters'; 
import './ExpenseItem.css';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  return (
      <li className="expense-item">
          <div className="expense-item__main">
              {/* Use formatDateReadable */}
              <div className="expense-item__date">{formatDateReadable(expense.date)}</div>
              <div className="expense-item__description">
                  {expense.description}
                  {expense.vendor && <span className="expense-item__vendor"> ({expense.vendor})</span>}
                  {/* Display Project if available (for Bob) */}
                  {expense.project && <span className="expense-item__project"> [{expense.project}]</span>}
              </div>
              <div className="expense-item__category">{expense.category}</div>
          </div>
           {/* Display Reimbursable status if available (for Bob) */}
          {expense.isReimbursable && <div className="expense-item__reimbursable">Reimbursable</div>}
           {/* Display notes etc. */}
          {/* Use formatCurrencyINR */}
          <div className="expense-item__amount">{formatCurrencyINR(expense.amount)}</div>
          <div className="expense-item__actions">
              <button onClick={() => onEdit(expense)} className="edit-btn">Edit</button>
              <button onClick={() => onDelete(expense._id)} className="delete-btn">Delete</button>
          </div>
      </li>
  );
};

export default ExpenseItem;