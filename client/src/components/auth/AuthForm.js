// client/src/components/auth/AuthForm.js
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaExclamationCircle } from 'react-icons/fa'; // Import icons
import './AuthForm.css';

const AuthForm = ({ isRegister = false }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [formError, setFormError] = useState('');
    const { login, register, loading, error: authError, clearError } = useAuth();
    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => { /* ... same as before ... */
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (formError) setFormError('');
        if (authError) clearError();
    };
    const onSubmit = async (e) => { /* ... same as before ... */
        e.preventDefault();
        setFormError('');
        if (authError) clearError();
        if (isRegister) {
            if (password !== confirmPassword) return setFormError('Passwords do not match');
            if (password.length < 6) return setFormError('Password must be at least 6 characters');
            await register({ name, email, password });
        } else {
            await login({ email, password });
        }
    };

    // Animation variants for the form container
    const formVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, delay: 0.3 } // Delay slightly after layout appears
        },
    };

    return (
        // Use motion.div for animation
        <motion.div
            className="auth-form-container"
            variants={formVariants}
            initial="hidden" // Start hidden (relative to parent's animation state)
            animate="visible" // Animate to visible
        >
            <h2>{isRegister ? 'Create Account' : 'Welcome Back!'}</h2>
            <form onSubmit={onSubmit}>
                {isRegister && (
                    <div className="form-group icon-input">
                        <FaUser className="input-icon" /> {/* Icon */}
                        <input type="text" name="name" placeholder="Full Name" value={name} onChange={onChange} required />
                    </div>
                )}
                <div className="form-group icon-input">
                     <FaEnvelope className="input-icon" /> {/* Icon */}
                    <input type="email" name="email" placeholder="Email Address" value={email} onChange={onChange} required />
                </div>
                <div className="form-group icon-input">
                     <FaLock className="input-icon" /> {/* Icon */}
                    <input type="password" name="password" placeholder="Password" value={password} onChange={onChange} required minLength={isRegister ? "6" : undefined} />
                </div>
                {isRegister && (
                    <div className="form-group icon-input">
                         <FaLock className="input-icon" /> {/* Icon */}
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={onChange} required />
                    </div>
                )}

                {/* Display Errors with Icon */}
                {formError && <p className="error-message"><FaExclamationCircle /> {formError}</p>}
                {authError && <p className="error-message"><FaExclamationCircle /> {authError}</p>}


                <motion.button
                    type="submit"
                    disabled={loading}
                    className="auth-button"
                    whileHover={{ scale: 1.03 }} // Hover effect
                    whileTap={{ scale: 0.98 }} // Tap effect
                >
                     {/* Icon on Button */}
                    {loading ? 'Processing...' : (
                        isRegister ? <><FaUserPlus /> Register</> : <><FaSignInAlt /> Login</>
                    )}
                </motion.button>
            </form>
            <div className="auth-switch-link">
                {isRegister ? (
                    <p>Already have an account? <Link to="/login">Login Here</Link></p>
                ) : (
                    <p>Don't have an account? <Link to="/register">Register Now</Link></p>
                )}
            </div>
        </motion.div>
    );
};

export default AuthForm;