import React, { useState, useContext } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Leaf, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { toast } from 'sonner';
import { AppContext } from '../context/AppContext';
import { getFirebaseErrorMessage } from '../components/utils/firebaseErrors';

export function Login() {
    const navigate = useNavigate();
    const { backEndUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const validateForm = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setFormErrors({});

        try {
            // Step 1: Authenticate with Firebase
            let firebaseIdToken = null;
            let firebaseUser = null;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                firebaseUser = userCredential.user;
                firebaseIdToken = await firebaseUser.getIdToken();
            } catch (firebaseError) {
                console.error('Firebase authentication error:', firebaseError);

                // Handle specific Firebase auth errors
                if (firebaseError.code === 'auth/user-not-found') {
                    toast.error("No account found with this email address.");
                } else if (firebaseError.code === 'auth/wrong-password') {
                    toast.error("Incorrect password. Please try again.");
                } else if (firebaseError.code === 'auth/invalid-email') {
                    toast.error("Please enter a valid email address.");
                } else if (firebaseError.code === 'auth/user-disabled') {
                    toast.error("This account has been disabled. Contact support.");
                } else if (firebaseError.code === 'auth/too-many-requests') {
                    toast.error("Too many failed attempts. Please try again later.");
                } else {
                    toast.error(getFirebaseErrorMessage(firebaseError));
                }
                return;
            }

            // Step 2: Authenticate with backend using Firebase token
            const loginPayload = {
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                firebaseIdToken,
                firebaseUid: firebaseUser.uid
            };

            const response = await axios.post(`${backEndUrl}/api/auth/login`, loginPayload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseIdToken}`
                },
                timeout: 10000 // 10 second timeout
            });

            if (response.data && response.data.success) {
                toast.success("Login successful!");

                // Update global state
                setIsLoggedIn(true);

                // Fetch user data
                try {
                    await getUserData();
                } catch (userDataError) {
                    console.warn('Failed to fetch user data:', userDataError);
                    // Don't fail login if we can't fetch user data
                }

                // Navigate based on user role
                const userRole = response.data.user?.role;
                if (userRole === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                toast.error(response.data?.message || "Invalid credentials. Please try again.");
            }

        } catch (error) {
            console.error('Login error:', error);

            // Handle different types of errors
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                toast.error("Request timeout. Please check your connection and try again.");
            } else if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || error.response.data?.error;

                if (error.response.status === 401) {
                    toast.error("Invalid email or password. Please try again.");
                } else if (error.response.status === 403) {
                    toast.error("Account access denied. Contact support if this continues.");
                } else if (error.response.status === 429) {
                    toast.error("Too many login attempts. Please wait and try again.");
                } else if (error.response.status >= 500) {
                    toast.error("Server error. Please try again later.");
                } else {
                    toast.error(errorMessage || "Login failed. Please try again.");
                }
            } else if (error.request) {
                // Request was made but no response received
                toast.error("Unable to connect to server. Please check your network connection.");
            } else {
                // Something else happened
                toast.error("An unexpected error occurred. Please try again.");
            }

            // Sign out from Firebase if backend login failed
            try {
                await auth.signOut();
            } catch (signOutError) {
                console.warn('Failed to sign out from Firebase:', signOutError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBack = () => navigate('/');
    const handleRegister = () => navigate('/register');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4">
            <div className="w-full max-w-md mb-20">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-6 text-muted-foreground hover:text-foreground cursor-pointer"
                    disabled={loading}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <Card className="shadow-xl border-0">
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Leaf className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to your PLUSTECH account to continue earning rewards
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your student email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${formErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                                {formErrors.email && (
                                    <div className="flex items-center mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.email}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 ${formErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 h-8 w-8 px-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {formErrors.password && (
                                    <div className="flex items-center mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.password}
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="w-full flex justify-center items-center bg-black text-white" disabled={loading}>
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                )}
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative w-full">
                            <Separator />
                        </div>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">Don't have an account? </span>
                            <Button
                                variant="link"
                                className="px-0 text-primary font-medium"
                                onClick={handleRegister}
                                disabled={loading}
                            >
                                Sign up here
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}