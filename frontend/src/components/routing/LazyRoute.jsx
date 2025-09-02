// components/routing/LazyRoute.jsx - Lazy loading wrapper
import React, { Suspense } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const LazyRoute = ({ component: Component, ...props }) => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Component {...props} />
        </Suspense>
    );
};