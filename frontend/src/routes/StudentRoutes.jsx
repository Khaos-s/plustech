// routes/StudentRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { StudentDashboard } from '../pages/StudentDashboard';
import { RewardsPage } from '../pages/RewardsPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { NotFound } from '../components/NotFound';

export const StudentRoutes = () => {
    return (
        <ProtectedRoute allowedRoles={["user"]}>
            <Routes>
                <Route path="/" element={<Navigation />}>
                    <Route index element={<StudentDashboard />} />
                    <Route path="rewards" element={<RewardsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ProtectedRoute>
    );
};