import React, { useState, useContext } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Leaf, Mail, Lock, Eye, EyeOff, User, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";
import { AppContext } from '../context/AppContext';

export function Register() {
    const navigate = useNavigate();
    const { backEndUrl } = useContext(AppContext);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false); // spinner state

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        secretCode: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.studentId) {
            return toast.error("Please fill in all required fields.");
        }

        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long.");
        }

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        try {
            setLoading(true); // start spinner
            const res = await axios.post(`${backEndUrl}/api/auth/register`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                studentId: formData.studentId,
                role: formData.role,
                secretCode: formData.secretCode,
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Registration successful!");
                navigate('/login'); // navigate to login after successful registration
            } else {
                toast.error(res.data.message || "Registration failed.");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Server error during registration.");
            } else if (error.request) {
                toast.error("No response from server. Check your network.");
            } else {
                toast.error("Error: " + error.message);
            }
        } finally {
            setLoading(false); // stop spinner
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleBack = () => navigate('/');
    const handleLogin = () => navigate('/login');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 py-8">
            <div className="w-full max-w-md">
                <Button variant="ghost" onClick={handleBack} className="mb-6 text-muted-foreground hover:text-foreground cursor-pointer">
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
                                            className="pl-10"
                                            required
                                        />
                                    </div>
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
                                        required
                                    />
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
                                        className="pl-10"
                                        required
                                    />
                                </div>
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
                                        className="pl-10"
                                        required
                                    />
                                </div>
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
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <Button type="button" variant="ghost" size="sm"
                                        className="absolute right-1 top-1 h-8 w-8 px-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
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
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <Button type="button" variant="ghost" size="sm"
                                        className="absolute right-1 top-1 h-8 w-8 px-0"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start space-x-2">
                                <input type="checkbox" id="terms" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-2.5" required />
                                <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                                    I agree to the{' '}
                                    <Button variant="link" className="px-0 text-primary h-auto font-normal text-sm">Terms of Service</Button>{' '}
                                    and{' '}
                                    <Button variant="link" className="px-0 text-primary h-auto font-normal text-sm">Privacy Policy</Button>
                                </Label>
                            </div>

                            {/* Submit Button with Spinner */}
                            <Button type="submit" className="w-full bg-black text-white flex justify-center items-center">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                ) : null}
                                {loading ? 'Creating...' : 'Create Account'}
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
                            <Button variant="link" className="px-0 text-primary font-medium" onClick={handleLogin}>
                                Sign in here
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
