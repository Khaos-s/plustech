import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Users, Recycle, BarChart3, Settings, MapPin, Award, TrendingUp, LogOut, ChevronDown
} from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'sonner';

export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, userData, logout } = useContext(AppContext); // ✅ Use context logout
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // ✅ FIXED: Use context logout function
    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        navigate('/');
        setIsProfileDropdownOpen(false);
    };



    // Get user initials for avatar
    const getUserInitials = (email) => {
        if (!email) return 'U';
        return email.charAt(0).toUpperCase();
    };

    // Get user display info
    const getUserDisplayInfo = () => {
        if (userData && userData.email) {
            return {
                initials: getUserInitials(userData.email),
                name: userData.firstName && userData.lastName
                    ? `${userData.firstName} ${userData.lastName}`
                    : userData.firstName || userData.email.split('@')[0],
                email: userData.email
            };
        }
        return {
            initials: 'A',
            name: 'Admin User',
            email: 'admin@university.edu'
        };
    };

    const navigationItems = [
        {
            section: 'Home',
            items: [
                { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
                { path: '/admin/students', icon: Users, label: 'Students' },
                { path: '/admin/smart-bins', icon: MapPin, label: 'Smart Bins' },
                { path: '/admin/rewards', icon: Award, label: 'Rewards' }
            ]
        },
        {
            section: 'System',
            items: [
                { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
                { path: '/admin/settings', icon: Settings, label: 'Settings' }
            ]
        }
    ];

    const isActivePath = (path) => {
        return location.pathname === path;
    };

    const userInfo = getUserDisplayInfo();

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 w-64 h-full bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Recycle className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">PLUSTECH Admin</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6">
                    {navigationItems.map((section) => (
                        <div key={section.section}>
                            <div className="text-gray-400 text-sm font-medium mb-2">
                                {section.section}
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${isActivePath(item.path)
                                                ? 'bg-gray-800 text-emerald-400'
                                                : 'hover:bg-gray-800 text-gray-300'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="w-full flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{userInfo.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm font-medium">{userInfo.name}</div>
                            <div className="text-xs text-gray-400 truncate">{userInfo.email}</div>
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
                            <div className="p-3 border-b border-gray-700">
                                <div className="text-sm font-medium">{userInfo.name}</div>
                                <div className="text-xs text-gray-400">{userInfo.email}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-750 transition-colors text-red-400 hover:text-red-300"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>

                    )}
                    {/* Overlay for mobile dropdown */}
                    {isProfileDropdownOpen && (
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsProfileDropdownOpen(false)}
                        />
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="ml-64">
                <Outlet />
            </div>


        </div>
    );
}