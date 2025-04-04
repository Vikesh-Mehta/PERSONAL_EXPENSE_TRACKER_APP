// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import authService from '../services/authService';
import notificationService from '../services/notificationService'; // Import notification service
import Spinner from '../components/common/Spinner'; // Optional: loading indicator

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true); // Start loading until token validity checked
    const [error, setError] = useState(null);

    // --- Notification State ---
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const pollIntervalRef = useRef(null); // Ref to store interval ID
    // ------------------------

    // Function to fetch user data based on token
    const fetchUser  = useCallback(async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            try {
                authService.setAuthToken(currentToken); // Ensure axios header is set
                const userData = await authService.getCurrentUser ();
                if (userData.success) {
                    setUser (userData.data); // user data is in 'data' field from /me
                    setToken(currentToken); // Confirm token is valid
                    fetchNotifications(); // Initial fetch notifications
                    startNotificationPolling(); // Start polling notifications
                } else {
                    throw new Error(userData.message || 'Failed to fetch user');
                }
            } catch (err) {
                console.error("AuthContext fetchUser  error:", err);
                authService.logout(); // Clear invalid token
                setUser (null);
                setToken(null);
                setError('Session expired or invalid. Please log in again.'); // Set user-friendly error
            }
        }
        setLoading(false); // Stop loading once checked
    }, []);

    // --- Notification Functions ---
    const fetchNotifications = useCallback(async () => {
        if (!localStorage.getItem('token')) return; // Only fetch if logged in
        try {
            const res = await notificationService.getUnread();
            if (res.success) {
                setNotifications(res.data); // Store the list of notifications
                setUnreadCount(res.totalUnread); // Store the count
            }
        } catch (err) {
            console.error("Polling notifications failed:", err);
            // Maybe stop polling if unauthorized?
            if (err?.response?.status === 401) {
                stopNotificationPolling();
            }
        }
    }, []); // Depends on token being available

    const startNotificationPolling = () => {
        stopNotificationPolling(); // Clear existing interval first
        console.log("Starting notification poll...");
        // Poll every 60 seconds (adjust interval as needed)
        pollIntervalRef.current = setInterval(fetchNotifications, 60000);
    };

    const stopNotificationPolling = () => {
        if (pollIntervalRef.current) {
            console.log("Stopping notification poll.");
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    const markNotificationRead = useCallback(async (id) => {
        try {
            await notificationService.markRead(id);
            // Refresh notifications immediately after marking read
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark notification read:", err);
        }
    }, [fetchNotifications]);

    const markAllNotificationsRead = useCallback(async () => {
        try {
            await notificationService.markAllRead();
            fetchNotifications(); // Refresh
        } catch (err) {
            console.error("Failed to mark all notifications read:", err);
        }
    }, [fetchNotifications]);
    // ---------------------------

    useEffect(() => {
        fetchUser ();
        // Cleanup interval on component unmount
        return () => stopNotificationPolling();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(credentials);
            if (data.success && data.token && data.user) {
                setUser (data.user);
                setToken(data.token);
                authService.setAuthToken(data.token); // Ensure axios header and localStorage are updated
                fetchNotifications(); // Fetch notifications on login
                startNotificationPolling(); // Start polling
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
    }, [fetchNotifications]);

    const register = useCallback(async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register(userData);
            if (data.success && data.token && data.user) {
                setUser (data.user);
                setToken(data.token);
                authService.setAuthToken(data.token); // Ensure axios header and localStorage are updated
                fetchNotifications(); // Fetch notifications on registration
                startNotificationPolling(); // Start polling
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
    }, [fetchNotifications]);

    const logout = useCallback(() => {
        stopNotificationPolling(); // Stop polling on logout
        authService.logout();
        setUser (null);
        setToken(null);
        setError(null);
        setNotifications([]); // Clear notification state
        setUnreadCount(0); // Clear unread count
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
        // --- Notification values ---
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        // ---------------------------
    }), [user, token, loading, error, login, register, logout, notifications, unreadCount, markNotificationRead, markAllNotificationsRead]);

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