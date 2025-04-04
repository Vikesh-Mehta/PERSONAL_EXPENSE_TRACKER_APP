// client/src/services/reportService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/reports/';

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => { /* ... (same auth interceptor) ... */
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));


// Get budget vs actual spending report
// params: { period: 'Monthly' | 'Yearly' | ..., date: 'YYYY-MM-DD' (optional) }
const getBudgetStatus = async (params) => {
    try {
        const response = await api.get('/budget-status', { params });
        return response.data; // { success, period, startDate, endDate, data: [...] }
    } catch (error) {
        console.error("Get Budget Status service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to fetch budget status report" };
    }
};

// Get spending by category report
// params: { period: 'Monthly' | 'Yearly' | ..., date: 'YYYY-MM-DD' (optional) }
const getSpendingByCategory = async (params) => {
    try {
        const response = await api.get('/category-summary', { params });
        return response.data; // { success, period, startDate, endDate, data: [...] }
    } catch (error) {
        console.error("Get Category Summary service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to fetch category summary" };
    }
};


const reportService = {
    getBudgetStatus,
    getSpendingByCategory,
};

export default reportService;