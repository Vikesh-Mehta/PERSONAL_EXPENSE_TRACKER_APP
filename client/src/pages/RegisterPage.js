// client/src/pages/RegisterPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && !loading) {
            console.log("Register Page: Already authenticated, redirecting to /dashboard");
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

     // Don't render the form if we are loading or already authenticated and about to redirect
    if (loading || isAuthenticated) {
        return null; // Or a loading indicator if preferred
    }

    return (
        <div>
            {/* <h1>Register</h1> */}
            <AuthForm isRegister={true} />
        </div>
    );
};

export default RegisterPage;