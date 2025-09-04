import React, { useState, useContext } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Leaf, Mail, Lock, Eye, EyeOff, User, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from "sonner";

export function Register() {
    const navigate = useNavigate();
    const { registerWithVerification } = useContext(AppContext);
    const [verificationLink, setVerificationLink] = useState(null);


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        password: '',
        confirmPassword: '',
        role: 'user', // Changed from 'student' to 'user'
        secretCode: '',
        department: '',
        course: '',
        RFID: ''
    });

    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.studentId.trim()) {
            errors.studentId = 'Student ID is required';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (formData.role === 'admin' && !formData.secretCode.trim()) {
            errors.secretCode = 'Secret code is required for admin accounts';
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
            const registrationData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
                password: formData.password,
                studentId: formData.studentId.trim(),
                role: formData.role,
                secretCode: formData.secretCode.trim(),
                department: formData.department.trim(),
                course: formData.course.trim(),
                RFID: formData.RFID.trim()
            };

            const result = await registerWithVerification(registrationData);

            if (result.success) {
                setRegistrationSuccess(true);
                setVerificationLink(result.verificationLink || null);
                toast.success("Registration successful! Please check your email for verification.");
            } else {
                toast.error(result.message || "Registration failed. Please try again.");
            }

        } catch (error) {
            console.error('Registration error:', error);
            toast.error("An unexpected error occurred. Please try again.");
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

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBack = () => navigate('/');
    const handleLogin = () => navigate('/login');

    // Show success message after registration
    if (registrationSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 py-8">
                <div className="w-full max-w-md">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="text-center pb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-green-700">Registration Successful!</CardTitle>
                            <CardDescription>
                                We've sent a verification email to <strong>{formData.email}</strong>
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="text-center space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-800">
                                    <strong>Next Steps:</strong>
                                </p>
                                <ol className="text-sm text-green-700 mt-2 space-y-1 text-left">
                                    <li>1. Check your email inbox</li>
                                    <li>
                                        2. {verificationLink ? (
                                            <a
                                                href={verificationLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Click here to verify your account
                                            </a>
                                        ) : (
                                            "Click the verification link"
                                        )}
                                    </li>
                                    <li>3. Return here to sign in</li>
                                </ol>

                                {verificationLink && (
                                    <p className="text-xs text-yellow-600 mt-2">
                                        ⚠️ This direct link is only shown in development mode
                                    </p>
                                )}
                            </div>

                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? Check your spam folder or contact support.
                            </p>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                onClick={handleLogin}
                                className="w-full bg-black text-white"
                            >
                                Go to Sign In
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleBack}
                                className="w-full"
                            >
                                Back to Home
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 py-8">
            <div className="w-full max-w-md">
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
                        <CardTitle className="text-2xl font-bold">Join PLUSTECH</CardTitle>
                        <CardDescription>
                            Create your account and start earning rewards for sustainable living
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`pl-10 ${formErrors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    {formErrors.firstName && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {formErrors.firstName}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`${formErrors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        disabled={loading}
                                    />
                                    {formErrors.lastName && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {formErrors.lastName}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Student ID */}
                            <div className="space-y-2">
                                <Label htmlFor="studentId" className="text-sm font-medium">Student ID</Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="studentId"
                                        name="studentId"
                                        type="text"
                                        placeholder="04-2324-09132"
                                        value={formData.studentId}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${formErrors.studentId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {formErrors.studentId && (
                                    <div className="flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.studentId}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Student Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john.doe@university.edu"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`pl-10 ${formErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {formErrors.email && (
                                    <div className="flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.email}
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 ${formErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        disabled={loading}
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
                                    <div className="flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.password}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`pl-10 pr-10 ${formErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        disabled={loading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 h-8 w-8 px-0"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {formErrors.confirmPassword && (
                                    <div className="flex items-center text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {formErrors.confirmPassword}
                                    </div>
                                )}
                            </div>

                            {/* Optional Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-sm font-medium">Department (Optional)</Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        type="text"
                                        placeholder="Computer Science"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course" className="text-sm font-medium">Course (Optional)</Label>
                                    <Input
                                        id="course"
                                        name="course"
                                        type="text"
                                        placeholder="BSIT"
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Admin Role Selection */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Account Type</Label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="user"
                                            name="role"
                                            value="user"
                                            checked={formData.role === 'user'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                            disabled={loading}
                                        />
                                        <Label htmlFor="user" className="text-sm">Student</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="admin"
                                            name="role"
                                            value="admin"
                                            checked={formData.role === 'admin'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                            disabled={loading}
                                        />
                                        <Label htmlFor="admin" className="text-sm">Admin</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Secret Code */}
                            {formData.role === 'admin' && (
                                <div className="space-y-2">
                                    <Label htmlFor="secretCode" className="text-sm font-medium">Admin Secret Code</Label>
                                    <Input
                                        id="secretCode"
                                        name="secretCode"
                                        type="password"
                                        placeholder="Enter admin secret code"
                                        value={formData.secretCode}
                                        onChange={handleInputChange}
                                        className={`${formErrors.secretCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required={formData.role === 'admin'}
                                        disabled={loading}
                                    />
                                    {formErrors.secretCode && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {formErrors.secretCode}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Terms */}
                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                                    required
                                    disabled={loading}
                                />
                                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                                    I agree to the{' '}
                                    <Button variant="link" className="px-0 text-primary h-auto font-normal text-sm">
                                        Terms of Service
                                    </Button>
                                    {' '}and{' '}
                                    <Button variant="link" className="px-0 text-primary h-auto font-normal text-sm">
                                        Privacy Policy
                                    </Button>
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-black text-white flex justify-center items-center"
                                disabled={loading}
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                )}
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <div className="relative w-full">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">or</span>
                        </div>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">Already have an account? </span>
                            <Button
                                variant="link"
                                className="px-0 text-primary font-medium"
                                onClick={handleLogin}
                                disabled={loading}
                            >
                                Sign in here
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}