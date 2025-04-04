// client/src/components/layout/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaTachometerAlt, FaPiggyBank, FaChartPie, FaSignOutAlt } from 'react-icons/fa';
import NotificationBell from './NotificationBell'; // Import NotificationBell component
import './Navbar.css'; // Create this CSS

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    // Only render the Navbar if the user is authenticated
    if (!isAuthenticated) {
        return null; // Don't show Navbar on login/register pages
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/dashboard">
                    {/* Optional: Add a logo/icon here */}
                    Expense Tracker
                </NavLink>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaTachometerAlt /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/budgets" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaPiggyBank /> Budgets
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                        <FaChartPie /> Reports
                    </NavLink>
                </li>
                {/* Add other links if needed */}
            </ul>
            <div className="navbar-user">
                <NotificationBell /> {/* Add the NotificationBell component here */}
                {user && <span className="user-name">Hi, {user.name}!</span>}
                <button onClick={handleLogout} className="logout-button-nav" title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;