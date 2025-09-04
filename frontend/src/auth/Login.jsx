import React, { useState, useContext } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Leaf, Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppContext } from '../context/AppContext';

export function Login() {
    const navigate = useNavigate();
    const { loginWithFirebase, resendVerificationEmail } = useContext(AppContext);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
    const [resendingVerification, setResendingVerification] = useState(false);

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
        setShowVerificationPrompt(false);

        try {
            const result = await loginWithFirebase(
                formData.email.toLowerCase().trim(),
                formData.password
            );

            if (result.success) {
                toast.success("Login successful!");

                // Navigate based on user role
                const userRole = result.user?.role;
                if (userRole === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                if (result.requiresVerification) {
                    setShowVerificationPrompt(true);
                    toast.error(result.message);
                } else {
                    toast.error(result.message || "Login failed. Please try again.");
                }
            }

        } catch (error) {
            console.error('Login error:', error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!formData.email) {
            toast.error("Please enter your email address first");
            return;
        }

        setResendingVerification(true);

        try {
            const result = await resendVerificationEmail(formData.email.toLowerCase().trim());
            
            if (result.success) {
                toast.success("Verification email sent! Please check your inbox.");
            } else {
                toast.error(result.message || "Failed to send verification email");
            }
        } catch (error) {
            toast.error("Failed to resend verification email");
        } finally {
            setResendingVerification(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

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
                        {showVerificationPrompt && (
                            <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-amber-800">Email Verification Required</h4>
                                        <p className="text-sm text-amber-700 mt-1">
                                            Please verify your email address before logging in. Check your inbox for the verification link.
                                        </p>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={handleResendVerification}
                                            disabled={resendingVerification}
                                            className="px-0 text-amber-700 hover:text-amber-800 h-auto mt-2"
                                        >
                                            {resendingVerification ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                'Resend verification email'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

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