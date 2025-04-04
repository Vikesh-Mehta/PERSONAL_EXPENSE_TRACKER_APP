// client/src/pages/BudgetPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetList from '../components/budgets/BudgetList';
import budgetService from '../services/budgetService';
import Spinner from '../components/common/Spinner';
import './BudgetPage.css'; // Create this CSS

const BudgetPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [budgetToEdit, setBudgetToEdit] = useState(null);

    const fetchBudgets = useCallback(async () => {
        try {
            setLoading(true); setError('');
            const response = await budgetService.getBudgets();
            if (response.success) {
                setBudgets(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch budgets');
            }
        } catch (err) {
            setError(err.message || 'Could not load budgets.');
            console.error("Budget page fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    const handleFormSubmit = () => {
        setBudgetToEdit(null); // Clear editing state
        fetchBudgets(); // Refresh list
    };

    const handleEditBudget = (budget) => {
        setBudgetToEdit(budget);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    };

    const handleCancelEdit = () => {
        setBudgetToEdit(null);
    };

    const handleDeleteBudget = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                // Optionally show loading state during delete
                await budgetService.deleteBudget(id);
                fetchBudgets(); // Refresh list
            } catch (err) {
                 setError(err.message || 'Failed to delete budget.');
                 console.error("Delete budget error:", err);
            }
        }
    };

    // Animation variants for page sections
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };
     const sectionVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };


    return (
        <motion.div
            className="budget-page-container"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.h1 variants={sectionVariants}>Manage Budgets</motion.h1>

            <motion.section className="budget-form-section" variants={sectionVariants}>
                <BudgetForm
                    budgetToEdit={budgetToEdit}
                    onFormSubmit={handleFormSubmit}
                    onCancelEdit={handleCancelEdit}
                />
            </motion.section>

            <motion.section className="budget-list-section" variants={sectionVariants}>
                {loading && budgets.length === 0 && <Spinner />}
                 {/* Pass loading/error state to BudgetList */}
                {!loading && (
                    <BudgetList
                        budgets={budgets}
                        onEdit={handleEditBudget}
                        onDelete={handleDeleteBudget}
                        loading={loading} // Already handled above, but can pass if needed
                        error={error}
                    />
                 )}
                 {/* Display general error if list fails to load */}
                 {error && !loading && budgets.length === 0 && <p className="list-message error">Error: {error}</p>}
            </motion.section>
        </motion.div>
    );
};

export default BudgetPage;