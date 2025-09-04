// components/EmailVerification.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, XCircle, RefreshCw, Mail } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'sonner';

export function EmailVerification() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { verifyEmailWithCode } = useContext(AppContext);

    const [verificationStatus, setVerificationStatus] = useState('processing'); // 'processing', 'success', 'error'
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');
    const continueUrl = searchParams.get('continueUrl');

    useEffect(() => {
        if (mode === 'verifyEmail' && actionCode) {
            handleEmailVerification();
        } else {
            setVerificationStatus('error');
            setMessage('Invalid verification link. Please check your email and try again.');
        }
    }, [mode, actionCode]);

    const handleEmailVerification = async () => {
        setLoading(true);

        try {
            const result = await verifyEmailWithCode(actionCode);

            if (result.success) {
                setVerificationStatus('success');
                setMessage('Your email has been verified successfully! You can now sign in to your account.');
                toast.success('Email verified successfully!');
            } else {
                setVerificationStatus('error');
                setMessage(result.message || 'Email verification failed. The link may be expired or invalid.');
                toast.error('Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
            setMessage('An unexpected error occurred during verification.');
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRetryVerification = () => {
        if (actionCode) {
            handleEmailVerification();
        }
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const renderContent = () => {
        if (loading || verificationStatus === 'processing') {
            return (
                <>
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-blue-700">Verifying Email</CardTitle>
                        <CardDescription>
                            Please wait while we verify your email address...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                                This may take a few moments. Please don't close this window.
                            </p>
                        </div>
                    </CardContent>
                </>
            );
        }

        if (verificationStatus === 'success') {
            return (
                <>
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-green-700">Email Verified!</CardTitle>
                        <CardDescription>
                            Your email address has been successfully verified
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                                {message}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleSignIn}
                                className="w-full bg-black text-white"
                            >
                                Sign In to Your Account
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleGoHome}
                                className="w-full"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </>
            );
        }

        if (verificationStatus === 'error') {
            return (
                <>
                    <CardHeader className="text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-red-700">Verification Failed</CardTitle>
                        <CardDescription>
                            We couldn't verify your email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-red-800">
                                {message}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div className="text-left">
                                    <h4 className="text-sm font-medium text-gray-800">What you can do:</h4>
                                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                                        <li>• Check if the link is complete and hasn't been truncated</li>
                                        <li>• Try requesting a new verification email</li>
                                        <li>• Contact support if the problem persists</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleRetryVerification}
                                variant="outline"
                                className="w-full"
                                disabled={!actionCode}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>

                            <Button
                                onClick={handleSignIn}
                                className="w-full bg-black text-white"
                            >
                                Go to Sign In
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleGoHome}
                                className="w-full"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 px-4 py-8">
            <div className="w-full max-w-md">
                <Card className="shadow-xl border-0">
                    {renderContent()}
                </Card>
            </div>
        </div>
    );
}