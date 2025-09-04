// components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isLoggedIn, userData } = useContext(AppContext);
    const location = useLocation();

    if (!isLoggedIn || !userData) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};