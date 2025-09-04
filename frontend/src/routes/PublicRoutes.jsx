// routes/PublicRoutes.jsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { LandingPage } from '../pages/LandingPage';
import { EarningSystemPage } from '../pages/EarningPage';
import { Login } from '../auth/Login';
import { Register } from '../auth/Register';
import { AuthRedirect } from '../components/AuthRedirect';
import { NotFound } from '../components/NotFound';
import { EmailVerification } from '../components/EmailVerification';

export const PublicRoutes = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/" element={<Navigation />}>
                <Route
                    index
                    element={
                        <LandingPage
                            onLogin={() => navigate("/login")}
                            onRegister={() => navigate("/register")}
                        />
                    }
                />
                <Route
                    path="/earning-system"
                    element={<EarningSystemPage />}
                />
                <Route
                    path="login"
                    element={
                        <AuthRedirect>
                            <Login
                                onBack={() => navigate("/")}
                                onRegister={() => navigate("/register")}
                            />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="register"
                    element={
                        <AuthRedirect>
                            <Register
                                onBack={() => navigate("/")}
                                onLogin={() => navigate("/login")}
                            />
                        </AuthRedirect>
                    }
                />
            </Route>
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};