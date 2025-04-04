// client/src/components/budgets/BudgetForm.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import expenseService from '../../services/expenseService'; // To get categories
import budgetService from '../../services/budgetService';
import { formatDateForInput } from '../../utils/formatters';
import { FaSave, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import './BudgetForm.css';

const BudgetForm = ({ budgetToEdit, onFormSubmit, onCancelEdit }) => {
    const [categories, setCategories] = useState([]);
    const budgetPeriods = ['Monthly', 'Yearly', 'Quarterly', 'Weekly']; // Add 'Custom' later if needed

    const initialState = {
        category: categories[0] || '',
        amount: '',
        period: 'Monthly',
        startDate: formatDateForInput(new Date()), // Default to today for start date input
        notes: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch categories
    useEffect(() => {
        const cats = expenseService.getStandardCategories();
        setCategories(cats);
        // Set default category only if not editing and categories are loaded
         if (!budgetToEdit && cats.length > 0) {
            setFormData(prev => ({ ...prev, category: cats[0] }));
        }
    }, [budgetToEdit]); // Re-run if budgetToEdit changes (though category list is static now)

    // Populate form if editing
    useEffect(() => {
        if (budgetToEdit) {
            setFormData({
                category: budgetToEdit.category || (categories.length > 0 ? categories[0] : ''),
                amount: budgetToEdit.amount || '',
                period: budgetToEdit.period || 'Monthly',
                // Use budget's start date, ensure it's formatted correctly
                startDate: formatDateForInput(budgetToEdit.startDate || new Date()),
                notes: budgetToEdit.notes || '',
            });
        } else {
             // Reset form, ensuring default category is set if categories are loaded
             setFormData({
                ...initialState,
                category: categories.length > 0 ? categories[0] : ''
            });
        }
    }, [budgetToEdit, categories]); // Dependency on categories ensures default is set after load

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.category || !formData.amount || !formData.period || !formData.startDate) {
            setError('Category, Amount, Period, and Start Date are required.');
            setLoading(false);
            return;
        }
        const amountNum = parseFloat(formData.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid positive amount.');
            setLoading(false);
            return;
        }

        // Ensure startDate is sent correctly (Date object or ISO string might be needed by backend)
        // Mongoose handles ISO strings well. Keep as YYYY-MM-DD for simplicity if backend handles it.
        const dataToSubmit = { ...formData, amount: amountNum };


        try {
            if (budgetToEdit) {
                await budgetService.updateBudget(budgetToEdit._id, dataToSubmit);
            } else {
                await budgetService.addBudget(dataToSubmit);
            }
            onFormSubmit(); // Notify parent to refresh list
            // Resetting handled by useEffect when budgetToEdit becomes null
        } catch (err) {
            setError(err.message || 'An error occurred. Check if a budget for this category/period already exists.');
            console.error("Budget form error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancelEdit) onCancelEdit();
         // Reset logic handled by useEffect when budgetToEdit becomes null
    };

     // Animation for the form container
    const formVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };


    return (
        <motion.form onSubmit={handleSubmit} className="budget-form" variants={formVariants} initial="hidden" animate="visible">
            <h3>{budgetToEdit ? 'Edit Budget' : 'Set New Budget'}</h3>
            {error && <p className="error-message"><FaExclamationCircle /> {error}</p>}

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="category">Category*</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} required disabled={!!budgetToEdit}>
                        {/* Allow changing category? Maybe not easily. Disable if editing */}
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div className="form-group">
                     <label htmlFor="amount">Budget Amount (INR)*</label>
                     <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" placeholder="e.g., 10000" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                     <label htmlFor="period">Period*</label>
                     <select id="period" name="period" value={formData.period} onChange={handleChange} required disabled={!!budgetToEdit}>
                         {/* Disable period/start date if editing for simplicity? */}
                         {budgetPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                 </div>
                 <div className="form-group">
                     <label htmlFor="startDate">Period Start Date*</label>
                     <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required disabled={!!budgetToEdit} />
                 </div>
            </div>

            <div className="form-group">
                 <label htmlFor="notes" className="optional">Notes</label>
                 <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="2"></textarea>
             </div>

             <div className="form-actions">
                <button type="submit" disabled={loading} className="save-btn">
                    <FaSave /> {loading ? 'Saving...' : (budgetToEdit ? 'Update Budget' : 'Set Budget')}
                </button>
                 {/* Show cancel only if editing */}
                 {budgetToEdit && (
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                        <FaTimes /> Cancel Edit
                    </button>
                )}
             </div>
        </motion.form>
    );
};

export default BudgetForm;