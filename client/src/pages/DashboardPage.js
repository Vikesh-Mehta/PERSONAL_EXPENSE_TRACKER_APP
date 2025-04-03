// client/src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import expenseService from '../services/expenseService';
import Spinner from '../components/common/Spinner'; // Assuming you have this
import './DashboardPage.css'; // Create this CSS file

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expenseToEdit, setExpenseToEdit] = useState(null); // State to hold expense being edited

    // Fetch expenses function
    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await expenseService.getExpenses();
            if (response.success) {
                setExpenses(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch expenses');
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError(err.message || 'Could not load expenses.');
            // Handle specific errors like 401 Unauthorized (e.g., token expired)
            if (err?.response?.status === 401 || err?.message?.includes('401')) {
                setError("Your session may have expired. Please log out and log back in.");
                // Consider calling logout() here automatically or prompting user
            }
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies needed if it doesn't rely on component state/props

    // Fetch expenses on initial load and when user changes (though user shouldn't change here often)
    useEffect(() => {
        if (user) { // Only fetch if user is loaded
            fetchExpenses();
        } else {
            setLoading(false); // If no user, stop loading
            setExpenses([]); // Clear expenses if user logs out
        }
    }, [user, fetchExpenses]);

    // Handler for form submission (add or update)
    const handleFormSubmit = () => {
        setExpenseToEdit(null); // Clear editing state
        fetchExpenses(); // Refresh the expense list
    };

    // Handler for deleting an expense
    const handleDeleteExpense = async (id) => {
        // Optional: Add a confirmation dialog
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                setLoading(true); // Optional: indicate loading during delete
                await expenseService.deleteExpense(id);
                fetchExpenses(); // Refresh list after successful delete
            } catch (err) {
                console.error("Delete error:", err);
                setError(err.message || 'Failed to delete expense.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handler for initiating the edit process
    const handleEditExpense = (expense) => {
        setExpenseToEdit(expense);
        // Optional: Scroll to the form for better UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handler for cancelling the edit mode in the form
    const handleCancelEdit = () => {
        setExpenseToEdit(null);
    };

    const handleLogout = () => {
        logout();
        // Navigation is handled by ProtectedRoute/App.js
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                {user ? (
                    <div className="user-info">
                        <h2>Welcome, {user.name}!</h2>
                        <p>Your email: {user.email}</p>
                        <p>This is your personalized dashboard. Expense tracking features will go here.</p>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </header>

            <main className="dashboard-content">
                {/* Expense Form Section */}
                <section className="expense-form-section">
                    <ExpenseForm
                        expenseToEdit={expenseToEdit}
                        onFormSubmit={handleFormSubmit}
                        onCancelEdit={handleCancelEdit}
                    />
                </section>

                {/* Expense List Section */}
                <section className="expense-list-section">
                    {/* Pass loading and error states to ExpenseList */}
                    <ExpenseList
                        expenses={expenses}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                        loading={loading && !expenseToEdit} // Only show list loading if not editing
                        error={error}
                    />
                    {/* Show main spinner if loading initially */}
                    {loading && expenses.length === 0 && <Spinner />}
                </section>

                {/* Add other sections later (Budgets, Reports, etc.) */}
                {/* <section className="budget-section">...</section> */}
                {/* <section className="reports-section">...</section> */}
            </main>
        </div>
    );
};

export default DashboardPage;