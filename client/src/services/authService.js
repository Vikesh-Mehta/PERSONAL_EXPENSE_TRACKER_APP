// client/src/services/authService.js
import axios from 'axios';

// Define the base URL for your backend API
// Make sure the backend server is running and accessible at this URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth/';

// Configure axios instance (optional, but good practice)
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to set the auth token for subsequent requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token); // Store token
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token'); // Remove token
    }
};

// Register user
const register = async (userData) => {
    try {
        const response = await api.post('register', userData);
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response.data; // Contains { success, token, user }
    } catch (error) {
        console.error("Registration service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Registration failed" };
    }
};

// Login user
const login = async (userData) => {
     try {
        const response = await api.post('login', userData);
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response.data; // Contains { success, token, user }
    } catch (error) {
        console.error("Login service error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Login failed" };
    }
};

// Logout user (simple token removal)
const logout = () => {
    setAuthToken(null);
    // Optionally: Could also call a backend /logout endpoint if it exists
};

// Get current user data (using the /me endpoint)
const getCurrentUser = async () => {
    // Ensure token is set in headers before calling
    const token = localStorage.getItem('token');
    if (token && !api.defaults.headers.common['Authorization']) {
        setAuthToken(token); // Set token if rehydrating state
    }

    try {
        const response = await api.get('me');
        return response.data; // Contains { success, data: user }
    } catch (error) {
        console.error("Get current user service error:", error.response?.data || error.message);
         // If token is invalid (e.g., expired), log the user out
        if (error.response?.status === 401) {
            logout();
        }
        throw error.response?.data || { message: "Failed to fetch user data" };
    }
}


const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    setAuthToken,
};

export default authService;