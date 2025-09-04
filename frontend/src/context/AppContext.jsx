// context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import FirebaseAuthService from '../services/firebaseAuthService.js';

axios.defaults.withCredentials = true;
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backEndUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = FirebaseAuthService.onAuthStateChanged(async (user) => {
            setFirebaseUser(user);

            if (!user) {
                setIsLoggedIn(false);
                setUserData(null);
                setAuthLoading(false);
            } else {
                // If Firebase user exists, check backend auth
                await getAuthState();
            }
        });

        return () => unsubscribe();
    }, []);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backEndUrl + '/api/user/me', { withCredentials: true });
            if (data.success) {
                setUserData(data.user);
                return data.user;
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            setUserData(null);
            setIsLoggedIn(false);
        }
        return null;
    };

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backEndUrl + '/api/auth/is-auth', { withCredentials: true });
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
                setAuthLoading(false);
                return true;
            } else {
                setIsLoggedIn(false);
                setUserData(null);
                setAuthLoading(false);
                return false;
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsLoggedIn(false);
            setUserData(null);
            setAuthLoading(false);
            return false;
        }
    };

    // Enhanced login with Firebase
    const loginWithFirebase = async (email, password) => {
        try {
            // 1. Sign in with Firebase
            const firebaseResult = await FirebaseAuthService.signInUser(email, password);

            if (!firebaseResult.success) {
                return {
                    success: false,
                    message: firebaseResult.message,
                    requiresVerification: firebaseResult.error === 'auth/user-not-found'
                };
            }

            // 2. Check email verification
            if (!firebaseResult.emailVerified) {
                return {
                    success: false,
                    message: "Please verify your email before logging in. Check your inbox for the verification link.",
                    requiresVerification: true,
                    canResendVerification: true
                };
            }

            // 3. Send credentials to backend for session creation
            const backendResponse = await axios.post(backEndUrl + '/api/auth/login', {
                email: email.toLowerCase().trim(),
                password: password,
                firebaseIdToken: firebaseResult.idToken
            }, { withCredentials: true });

            if (backendResponse.data.success) {
                setIsLoggedIn(true);
                setUserData(backendResponse.data.user);
                return {
                    success: true,
                    message: "Login successful!",
                    user: backendResponse.data.user
                };
            } else {
                return {
                    success: false,
                    message: backendResponse.data.message || "Backend authentication failed"
                };
            }

        } catch (error) {
            console.error('Login error:', error);

            if (error.response?.data?.emailVerificationRequired) {
                return {
                    success: false,
                    message: error.response.data.message,
                    requiresVerification: true,
                    canResendVerification: true
                };
            }

            return {
                success: false,
                message: error.response?.data?.message || "Login failed. Please try again."
            };
        }
    };

    // Register with email verification
    const registerWithVerification = async (userData) => {
        try {
            const response = await axios.post(backEndUrl + '/api/auth/register', userData, {
                withCredentials: true
            });

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    requiresVerification: true,
                    verificationLink: response.data.verificationLink
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || "Registration failed"
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed. Please try again."
            };
        }
    };

    // Resend verification email
    const resendVerificationEmail = async (email) => {
        try {
            const response = await axios.post(backEndUrl + '/api/auth/resend-verification', {
                email
            }, { withCredentials: true });

            return {
                success: response.data.success,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to resend verification email"
            };
        }
    };

    // Verify email with action code
    const verifyEmailWithCode = async (actionCode) => {
        try {
            // 1. Verify with Firebase
            const firebaseResult = await FirebaseAuthService.verifyEmailWithCode(actionCode);

            if (!firebaseResult.success) {
                return firebaseResult;
            }

            // 2. Get ID token and notify backend
            const tokenResult = await FirebaseAuthService.getCurrentUserToken();
            if (tokenResult.success) {
                await axios.post(backEndUrl + '/api/auth/verify-email', {
                    idToken: tokenResult.idToken
                }, { withCredentials: true });
            }

            return firebaseResult;
        } catch (error) {
            return {
                success: false,
                message: "Failed to verify email"
            };
        }
    };

    // Enhanced logout
    const logout = async () => {
        try {
            // 1. Sign out from Firebase
            await FirebaseAuthService.signOut();
            // 2. Clear backend session
            await axios.post(backEndUrl + '/api/auth/logout', {}, { withCredentials: true });
            // 3. Clear local state
            setIsLoggedIn(false);
            setUserData(null);
            setFirebaseUser(null);

            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear local state
            setIsLoggedIn(false);
            setUserData(null);
            setFirebaseUser(null);
            return { success: false, message: 'Logout failed, but cleared local session' };
        }
    };

    const value = {
        backEndUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        firebaseUser,
        authLoading,
        getUserData,
        getAuthState,
        loginWithFirebase,
        registerWithVerification,
        resendVerificationEmail,
        verifyEmailWithCode,
        logout,

        // Legacy methods for backward compatibility
        login: loginWithFirebase,
        register: registerWithVerification
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};