import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="space-x-4">
                    <Button onClick={() => window.history.back()} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                    <Button asChild>
                        <Link to="/">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;