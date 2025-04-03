// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import authService from '../services/authService';
import Spinner from '../components/common/Spinner'; // Optional: loading indicator

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true); // Start loading until token validity checked
    const [error, setError] = useState(null);

    // Function to fetch user data based on token
    const fetchUser = useCallback(async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                authService.setAuthToken(currentToken); // Ensure axios header is set
                const userData = await authService.getCurrentUser();
                if (userData.success) {
                    setUser(userData.data); // user data is in 'data' field from /me
                    setToken(currentToken); // Confirm token is valid
                } else {
                    throw new Error(userData.message || 'Failed to fetch user');
                }
            } catch (err) {
                console.error("AuthContext fetchUser error:", err);
                authService.logout(); // Clear invalid token
                setUser(null);
                setToken(null);
                setError('Session expired or invalid. Please log in again.'); // Set user-friendly error
            }
        }
        setLoading(false); // Stop loading once checked
    }, []);


    // Check token validity on initial load
    useEffect(() => {
        fetchUser();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount


    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(credentials);
             if (data.success && data.token && data.user) {
                setUser(data.user);
                setToken(data.token);
                authService.setAuthToken(data.token); // Ensure axios header and localStorage are updated
                 setLoading(false);
                return true; // Indicate success
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (err) {
            console.error("AuthContext login error:", err);
            setError(err.message || 'Invalid credentials.');
            setLoading(false);
            return false; // Indicate failure
        }
    }, []);


    const register = useCallback(async (userData) => {
        setLoading(true);
        setError(null);
        try {
           const data = await authService.register(userData);
            if (data.success && data.token && data.user) {
                setUser(data.user);
                setToken(data.token);
                authService.setAuthToken(data.token); // Ensure axios header and localStorage are updated
                setLoading(false);
                return true; // Indicate success
            } else {
                 throw new Error(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error("AuthContext register error:", err);
             setError(err.message || 'Could not register user.');
            setLoading(false);
            return false; // Indicate failure
        }
    }, []);

     const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setToken(null);
        setError(null);
         // Optionally redirect user after logout (handled in component or App.js)
    }, []);


    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        token,
        isAuthenticated: !!user && !!token, // Simple check for authentication status
        loading,
        error,
        login,
        register,
        logout,
        clearError: () => setError(null), // Function to clear errors
    }), [user, token, loading, error, login, register, logout]);


    // Optional: Show loading spinner while checking auth status
    if (loading && !user && localStorage.getItem('token')) {
         return <Spinner />; // Or some other loading indicator
    }


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;