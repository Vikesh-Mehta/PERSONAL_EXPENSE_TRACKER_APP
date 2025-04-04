// client/src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import expenseService from '../services/expenseService';
import Spinner from '../components/common/Spinner';
import { motion, AnimatePresence } from 'framer-motion'; // Import animation components
import { FaSignOutAlt, FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa'; // Icons
import { formatCurrencyINR } from '../utils/formatters'; // Import formatter
import './DashboardPage.css';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [showForm, setShowForm] = useState(false); // Control form visibility

    // --- Fetch Expenses Logic (same as before) ---
    const fetchExpenses = useCallback(async () => { /* ... */
        try {
            setLoading(true); setError('');
            const response = await expenseService.getExpenses();
            if (response.success) setExpenses(response.data);
            else throw new Error(response.message || 'Failed to fetch expenses');
        } catch (err) { /* ... error handling ... */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        if (user) fetchExpenses();
        else { setLoading(false); setExpenses([]); }
    }, [user, fetchExpenses]);

    // --- Handlers (same logic, maybe adjust form visibility) ---
    const handleFormSubmit = () => {
        setExpenseToEdit(null);
        fetchExpenses();
        setShowForm(false); // Hide form after submit
    };
    const handleDeleteExpense = async (id) => { /* ... same as before ... */
        if (window.confirm('Are you sure?')) {
            try { /* ... delete logic ... */ await expenseService.deleteExpense(id); fetchExpenses(); }
            catch (err) { /* ... error handling ... */ }
        }
    };
    const handleEditExpense = (expense) => {
        setExpenseToEdit(expense);
        setShowForm(true); // Ensure form is visible for editing
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleCancelEdit = () => {
        setExpenseToEdit(null);
        setShowForm(false); // Hide form on cancel
    };
    const handleLogout = () => logout();

    // --- Animation Variants ---
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };

    const formContainerVariants = {
        hidden: { height: 0, opacity: 0, marginBottom: 0 },
        visible: { height: 'auto', opacity: 1, marginBottom: '40px', transition: { duration: 0.4, ease: "easeInOut" } }
    };


    // Calculate total expenses for the current view (optional)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <motion.div
            className="dashboard-container"
            initial="hidden"
            animate="visible"
            variants={sectionVariants} // Apply variants to container
        >
            {/* --- Dashboard Header --- */}
            <motion.header className="dashboard-header" variants={sectionVariants}>
                 <h1>Dashboard</h1>
                 {user ? (
                     <div className="user-info">
                         <motion.span
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: 0.2 }}
                         >
                             Welcome, {user.name}!
                         </motion.span>
                         <motion.button
                             onClick={handleLogout}
                             className="logout-button"
                             whileHover={{ scale: 1.05, backgroundColor: "#c82333" }}
                             whileTap={{ scale: 0.95 }}
                         >
                             <FaSignOutAlt /> Logout
                         </motion.button>
                     </div>
                 ) : ( <p>Loading user...</p> )}
            </motion.header>

            {/* --- Content Area --- */}
            <main className="dashboard-content">

                 {/* --- Toggle Add Expense Button --- */}
                 {!showForm && (
                     <motion.button
                         className="toggle-form-button"
                         onClick={() => { setExpenseToEdit(null); setShowForm(true); }}
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                     >
                         <FaPlusCircle /> Add New Expense
                     </motion.button>
                 )}

                {/* --- Animated Expense Form Section --- */}
                {/* AnimatePresence helps animate components that mount/unmount */}
                <AnimatePresence>
                    {showForm && (
                         <motion.section
                             key="expense-form-section" // Key is important for AnimatePresence
                             className="expense-form-section"
                             variants={formContainerVariants}
                             initial="hidden"
                             animate="visible"
                             exit="hidden" // Animate out
                         >
                            <ExpenseForm
                                expenseToEdit={expenseToEdit}
                                onFormSubmit={handleFormSubmit}
                                onCancelEdit={handleCancelEdit}
                            />
                        </motion.section>
                    )}
                 </AnimatePresence>

                 {/* --- Total Expenses Display (Optional) --- */}
                 {!loading && expenses.length > 0 && (
                     <motion.div className="total-expenses-display" variants={sectionVariants}>
                         <h3>Total Recorded Expenses:</h3>
                         <span className="total-amount">{formatCurrencyINR(totalExpenses)}</span>
                     </motion.div>
                 )}


                 {/* --- Expense List Section --- */}
                <motion.section className="expense-list-section" variants={sectionVariants}>
                     {/* ExpenseList itself doesn't need motion if items animate */}
                    <ExpenseList
                        expenses={expenses}
                        onEdit={handleEditExpense} // Pass icons if needed, or handle in Item
                        onDelete={handleDeleteExpense}
                        loading={loading}
                        error={error}
                     />
                     {loading && expenses.length === 0 && <Spinner />}
                </motion.section>

             </main>
        </motion.div>
    );
};

export default DashboardPage;