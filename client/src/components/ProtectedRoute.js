// client/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './common/Spinner'; // Optional loading indicator

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation(); // Get current location

    console.log(`ProtectedRoute for ${location.pathname}: loading=${loading}, isAuthenticated=${isAuthenticated}`); // Log authentication status

    if (loading) {
        console.log(`ProtectedRoute for ${location.pathname}: Showing Spinner`); // Log when showing spinner
        return <Spinner />;
    }

    if (!isAuthenticated) {
        console.log(`ProtectedRoute for ${location.pathname}: Redirecting to /login`); // Log redirection to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log(`ProtectedRoute for ${location.pathname}: Rendering children`); // Log when rendering children
    return children; // Render the protected page component
};

export default ProtectedRoute;