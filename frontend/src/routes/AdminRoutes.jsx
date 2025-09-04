// routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { StudentsPage } from '../pages/admin/StudentsPage';
import { SmartBinsPage } from '../pages/admin/SmartBinPage';
import { AdminRewardsPage } from '../pages/admin/RewardsManagement';
import { AnalyticsPage } from '../pages/admin/AnalyticsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { NotFound } from '../components/NotFound';

export const AdminRoutes = () => {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <Routes>
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="students" element={<StudentsPage />} />
                    <Route path="smart-bins" element={<SmartBinsPage />} />
                    <Route path="rewards" element={<AdminRewardsPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    {/* <Route path="settings" element={<SettingsPage />} /> */}
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ProtectedRoute>
    );
};