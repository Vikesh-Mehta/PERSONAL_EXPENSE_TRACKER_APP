// client/src/pages/LoginPage.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && !loading) {
             // Redirect to dashboard or intended page after login
             const from = location.state?.from?.pathname || '/dashboard';
             console.log("Login Page: Already authenticated, redirecting to", from);
             navigate(from, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, location.state]);

     // Don't render the form if we are loading or already authenticated and about to redirect
    if (loading || isAuthenticated) {
        return null; // Or a loading indicator if preferred
    }


    return (
        <div>
            {/* <h1>Login</h1> */}
            <AuthForm isRegister={false} />
        </div>
    );
};

export default LoginPage;