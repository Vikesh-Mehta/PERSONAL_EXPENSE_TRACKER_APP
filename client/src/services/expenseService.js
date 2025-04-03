// client/src/services/expenseService.js
import axios from 'axios';

// Define the base URL for your backend API expenses endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/expenses/';

// Use a pre-configured axios instance if available (from authService),
// or create a new one. It's important that the auth token is set in the headers.
// We rely on the AuthContext setting the token globally via authService.setAuthToken.
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to get the token from storage - ensures token is fresh if needed elsewhere
const getToken = () => localStorage.getItem('token');

// Interceptor to add the token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Get all expenses for the logged-in user
const getExpenses = async () => {
    try {
        const response = await api.get('/'); // GET request to API_URL base ('/api/expenses/')
        return response.data; // Contains { success, count, data: [expenses] }
    } catch (error) {
        console.error("Get Expenses service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to fetch expenses" };
    }
};

// Add a new expense
const addExpense = async (expenseData) => {
    try {
        const response = await api.post('/', expenseData); // POST request to API_URL base
        return response.data; // Contains { success, data: newExpense }
    } catch (error) {
        console.error("Add Expense service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to add expense" };
    }
};

// Update an existing expense
const updateExpense = async (id, expenseData) => {
    try {
        const response = await api.put(`/${id}`, expenseData); // PUT request to /api/expenses/:id
        return response.data; // Contains { success, data: updatedExpense }
    } catch (error) {
        console.error("Update Expense service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to update expense" };
    }
};

// Delete an expense
const deleteExpense = async (id) => {
    try {
        const response = await api.delete(`/${id}`); // DELETE request to /api/expenses/:id
        return response.data; // Contains { success, data: {}, message: 'Expense removed' }
    } catch (error) {
        console.error("Delete Expense service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to delete expense" };
    }
};

// Export available categories (hardcoded for now, matching backend enum)
// In a real app, you might fetch this from a dedicated /api/categories endpoint
const getStandardCategories = () => {
    return [
        'Groceries', 'Utilities', 'Rent/Mortgage', 'Transportation', 'Dining Out',
        'Entertainment', 'Healthcare', 'Clothing', 'Personal Care', 'Education',
        'Gifts/Donations', 'Travel', 'Insurance', 'Subscriptions', 'Other'
    ];
};


const expenseService = {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getStandardCategories
};

export default expenseService;