// client/src/pages/RegisterPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/auth/AuthLayout'; // Import the layout
import Spinner from '../components/common/Spinner'; // Import Spinner

const RegisterPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

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
            <AuthForm isRegister={true} />
        </AuthLayout>
    );
};

export default RegisterPage;