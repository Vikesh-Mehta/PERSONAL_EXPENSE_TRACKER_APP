// client/src/components/expenses/ExpenseList.js
import React from 'react';
import ExpenseItem from './ExpenseItem';
import './ExpenseList.css'; // Create this CSS file

const ExpenseList = ({ expenses, onEdit, onDelete, loading, error }) => {

    if (loading) {
        return <p className="list-message">Loading expenses...</p>; // Or use Spinner component
    }

    if (error) {
        return <p className="list-message error">Error fetching expenses: {error}</p>;
    }

    if (!expenses || expenses.length === 0) {
        return <p className="list-message">No expenses recorded yet. Add one above!</p>;
    }

    return (
        <div className="expense-list-container">
            <h3>Your Expenses</h3>
            <ul className="expense-list">
                {expenses.map((expense) => (
                    <ExpenseItem
                        key={expense._id} // Use MongoDB's _id as the key
                        expense={expense}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;