// components/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};