// client/src/services/budgetService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/budgets/';

// Use Axios instance with interceptor for auth token (like in expenseService)
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Get all budgets (backend should calculate current spending)
const getBudgets = async () => {
    try {
        const response = await api.get('/');
        return response.data; // { success, count, data: [budgetsWithSpending] }
    } catch (error) {
        console.error("Get Budgets service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to fetch budgets" };
    }
};

// Add a new budget
const addBudget = async (budgetData) => {
    try {
        const response = await api.post('/', budgetData);
        return response.data; // { success, data: newBudget }
    } catch (error) {
        console.error("Add Budget service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to add budget" };
    }
};

// Update an existing budget
const updateBudget = async (id, budgetData) => {
    try {
        const response = await api.put(`/${id}`, budgetData);
        return response.data; // { success, data: updatedBudget }
    } catch (error) {
        console.error("Update Budget service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to update budget" };
    }
};

// Delete a budget
const deleteBudget = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data; // { success, data: {}, message: 'Budget removed' }
    } catch (error) {
        console.error("Delete Budget service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to delete budget" };
    }
};

const budgetService = {
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
};

export default budgetService;