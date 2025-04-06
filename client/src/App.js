// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage'; // Optional
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Navbar from './components/layout/Navbar';
import './App.css'; // Import main CSS
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';
import useAuth from './hooks/useAuth';
import Spinner from './components/common/Spinner';

function App() {
    return (
        <AuthProvider> {/* Wrap entire app in AuthProvider */}
            <Router>
                <div className="App">
                    <Navbar /> {/* Optional: Place Navbar here if you want it on all pages */}
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirect root to login */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/budgets" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                        {/* Add other protected routes here later (e.g., /expenses) */}
                        {/* <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} /> */}

                        {/* Catch-all Not Found Route */}
                        <Route path="*" element={<NotFoundPage />} /> {/* Ensure a catch-all exists */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;