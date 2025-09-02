// components/routing/ProtectedRoute.jsx - Route protection wrapper
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

export const ProtectedRoute = ({
    children,
    requireAuth = true,
    allowedRoles = [],
    redirectTo = "/login"
}) => {
    const { isLoggedIn, userData } = useContext(AppContext);
    const location = useLocation();

    // Check if authentication is required
    if (requireAuth && !isLoggedIn) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(userData?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};