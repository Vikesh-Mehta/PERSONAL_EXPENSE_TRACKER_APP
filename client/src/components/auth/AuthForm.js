// client/src/components/auth/AuthForm.js
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth'; // Import the custom hook
import { Link } from 'react-router-dom'; // For linking between login/register
import './AuthForm.css'; // Add some basic styling

const AuthForm = ({ isRegister = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '', // Only for registration
    });
    const [formError, setFormError] = useState(''); // Specific form errors (e.g., password mismatch)

    const { login, register, loading, error: authError, clearError } = useAuth(); // Get functions and state from context

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
         // Clear errors when user starts typing again
        if (formError) setFormError('');
        if (authError) clearError();
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // Clear previous form errors
        if (authError) clearError(); // Clear previous auth errors


        if (isRegister) {
            if (password !== confirmPassword) {
                setFormError('Passwords do not match');
                return;
            }
             if (password.length < 6) {
                setFormError('Password must be at least 6 characters');
                return;
            }
            await register({ name, email, password });
            // Navigation will be handled by the page component based on success/failure
        } else {
            await login({ email, password });
             // Navigation will be handled by the page component based on success/failure
        }
    };

    return (
        <div className="auth-form-container">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={onSubmit}>
                {isRegister && (
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength={isRegister ? "6" : undefined} // Enforce minLength only on register visually
                    />
                </div>
                {isRegister && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                        />
                    </div>
                )}

                {/* Display Errors */}
                {formError && <p className="error-message">{formError}</p>}
                {authError && <p className="error-message">{authError}</p>}


                <button type="submit" disabled={loading} className="auth-button">
                    {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
                </button>
            </form>
            <div className="auth-switch-link">
                {isRegister ? (
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                ) : (
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                )}
            </div>
        </div>
    );
};

export default AuthForm;