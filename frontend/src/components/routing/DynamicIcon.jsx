// components/routing/DynamicIcon.jsx - Dynamic icon loader
import React, { useState, useEffect } from 'react';

export const DynamicIcon = ({ iconName, className = "w-4 h-4" }) => {
    const [Icon, setIcon] = useState(null);

    useEffect(() => {
        if (!iconName) return;

        const loadIcon = async () => {
            try {
                const iconModule = await import('lucide-react');
                const IconComponent = iconModule[iconName];
                if (IconComponent) {
                    setIcon(() => IconComponent);
                }
            } catch (error) {
                console.warn(`Failed to load icon: ${iconName}`, error);
            }
        };

        loadIcon();
    }, [iconName]);

    if (!Icon) return null;

    return <Icon className={className} />;
};