// components/AuthRedirect.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const AuthRedirect = ({ children }) => {
    const { isLoggedIn, userData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isLoggedIn && userData) {
            // If user is on auth pages and is logged in, redirect to appropriate dashboard
            if (location.pathname === '/login' || location.pathname === '/register') {
                const redirectTo = userData.role === 'admin' ? '/admin/dashboard' : '/dashboard';
                navigate(redirectTo, { replace: true });
            }
        }
    }, [isLoggedIn, userData, location.pathname, navigate]);

    return children;
};