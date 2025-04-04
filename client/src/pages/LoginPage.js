// client/src/pages/LoginPage.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout'; // Import the layout
import Spinner from '../components/common/Spinner'; // Import Spinner

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (isAuthenticated && !loading) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, location.state]);

    // Show spinner centered if loading auth state initially
    if (loading) {
        return <Spinner />;
    }

    // If authenticated, don't render anything (will redirect)
    if (isAuthenticated) {
        return null;
    }

    return (
        // Use the AuthLayout
        <AuthLayout>
            <AuthForm isRegister={false} />
        </AuthLayout>
    );
};

export default LoginPage;