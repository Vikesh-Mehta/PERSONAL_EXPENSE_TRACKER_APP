// client/src/components/expenses/ExpenseForm.js
import React, { useState, useEffect } from 'react';
import expenseService from '../../services/expenseService';
import { formatDateForInput } from '../../utils/formatters'; // Import date formatter
import './ExpenseForm.css';

// Assume standardCategories are fetched or imported correctly
// const categories = expenseService.getStandardCategories();

const ExpenseForm = ({ expenseToEdit, onFormSubmit, onCancelEdit }) => {
    // Fetch categories dynamically (or pass as prop)
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        setCategories(expenseService.getStandardCategories());
    }, []);


    const initialState = {
        description: '',
        amount: '',
        category: categories[0] || '', // Default category
        date: formatDateForInput(new Date()), // Format today's date
        notes: '',
        vendor: '',
        paymentMethod: '',
        project: '', // New field
        isReimbursable: false, // New field
        receiptUrl: '', // New field (basic input for now, real upload is complex)
    };

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (expenseToEdit) {
            setFormData({
                description: expenseToEdit.description || '',
                amount: expenseToEdit.amount || '',
                category: expenseToEdit.category || (categories.length > 0 ? categories[0] : ''),
                date: formatDateForInput(expenseToEdit.date), // Format existing date
                notes: expenseToEdit.notes || '',
                vendor: expenseToEdit.vendor || '',
                paymentMethod: expenseToEdit.paymentMethod || '',
                project: expenseToEdit.project || '', // Populate new fields
                isReimbursable: expenseToEdit.isReimbursable || false,
                receiptUrl: expenseToEdit.receiptUrl || '',
            });
        } else {
            setFormData({
                ...initialState,
                date: formatDateForInput(new Date()), // Ensure date resets correctly
                category: categories.length > 0 ? categories[0] : ''
            });
        }
    }, [expenseToEdit, categories]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            // Handle checkbox separately
            [name]: type === 'checkbox' ? checked : value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (validation remains similar, check required fields)
        setError('');
        setLoading(true);
        if (!formData.description || !formData.amount || !formData.category || !formData.date) { /*...*/ return; }
        if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) { /*...*/ return; }

        try {
            const dataToSubmit = { ...formData, amount: parseFloat(formData.amount) };
            if (expenseToEdit) {
                await expenseService.updateExpense(expenseToEdit._id, dataToSubmit);
            } else {
                await expenseService.addExpense(dataToSubmit);
            }
            onFormSubmit();
            setFormData({ // Reset form
                 ...initialState,
                 date: formatDateForInput(new Date()),
                 category: categories.length > 0 ? categories[0] : ''
            });
        } catch (err) { /* ... error handling ... */ }
        finally { setLoading(false); }
    };

    const handleCancel = () => { /* ... cancel logic ... */
         if (expenseToEdit && onCancelEdit) onCancelEdit();
         setFormData({
             ...initialState,
             date: formatDateForInput(new Date()),
             category: categories.length > 0 ? categories[0] : ''
         });
         setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <h3>{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</h3>
            {error && <p className="error-message">{error}</p>}

            {/* Row 1: Description, Amount */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="description">Description*</label>
                    <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount (INR)*</label> {/* Indicate Currency */}
                    <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" placeholder="e.g., 1500.50" />
                </div>
            </div>

            {/* Row 2: Category, Date */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="category">Category*</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date*</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
            </div>

             {/* Row 3: Vendor, Payment Method (Optional) */}
             <div className="form-row">
                 <div className="form-group">
                     <label htmlFor="vendor" className="optional">Vendor</label>
                     <input type="text" id="vendor" name="vendor" value={formData.vendor} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                     <label htmlFor="paymentMethod" className="optional">Payment Method</label>
                     <input type="text" id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} />
                 </div>
             </div>

            {/* --- Business/Project Specific Fields --- */}
            <div className="form-section business-fields"> {/* Optional: Group visually */}
                 <h4>Business Details (Optional)</h4>
                 <div className="form-row">
                     <div className="form-group">
                         <label htmlFor="project" className="optional">Project/Client</label>
                         <input type="text" id="project" name="project" value={formData.project} onChange={handleChange} />
                     </div>
                     <div className="form-group">
                         <label htmlFor="receiptUrl" className="optional">Receipt URL</label>
                         <input type="text" id="receiptUrl" name="receiptUrl" value={formData.receiptUrl} onChange={handleChange} placeholder="Link to uploaded receipt" />
                         {/* Note: Actual file upload requires more work (multer backend, frontend state for file) */}
                     </div>
                 </div>
                 <div className="form-group checkbox-group">
                     <input type="checkbox" id="isReimbursable" name="isReimbursable" checked={formData.isReimbursable} onChange={handleChange} />
                     <label htmlFor="isReimbursable">Is this expense reimbursable?</label>
                 </div>
            </div>
             {/* -------------------------------------- */}


             {/* Notes Field */}
            <div className="form-group">
                <label htmlFor="notes" className="optional">Notes</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
            </div>

            <div className="form-actions">
                {/* ... buttons ... */}
                <button type="submit" disabled={loading}> {/* ... */} </button>
                {(expenseToEdit || formData.description || formData.amount ) && (
                    <button type="button" onClick={handleCancel} className="cancel-btn"> {/* ... */} </button>
                )}
            </div>
        </form>
    );
};

export default ExpenseForm;