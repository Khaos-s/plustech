import React, { useContext, useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Recycle, User, Settings, Gift, ArrowRight, LogOut, ChevronDown, UserCircle, Award } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "sonner";

export function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, userData, setIsLoggedIn, setUserData, backEndUrl, logout } = useContext(AppContext);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogin = () => {
        navigate('/login');
    };

    //  logout function
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

    const handleDashboard = () => {
        if (userData?.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
        setIsProfileDropdownOpen(false);
    };

    const handleSettings = () => {
        navigate('/settings');
        setIsProfileDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get user initials for avatar
    const getUserInitials = (email) => {
        if (!email) return 'U';
        return email.charAt(0).toUpperCase();
    };

    const getUserDisplayName = () => {
        if (userData?.firstName && userData?.lastName) {
            return `${userData.firstName} ${userData.lastName}`;
        } else if (userData?.firstName) {
            return userData.firstName;
        } else if (userData?.email) {
            return userData.email.split('@')[0]; // Use email prefix if no name
        }
        return 'User';
    };

    return (
        <>
            <nav className="bg-card shadow-sm bg-white border-border px-4 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Recycle className="w-8 h-8 text-primary" />
                        <h1 className="text-xl font-semibold">PLUSTECH</h1>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Show navigation based on login status and role */}
                        {isLoggedIn && userData?.role === 'student' && (
                            <>
                                <Button
                                    variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                                    asChild
                                >
                                    <Link to="/dashboard" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button
                                    variant={location.pathname === '/rewards' ? 'default' : 'ghost'}
                                    asChild
                                >
                                    <Link to="/rewards" className="flex items-center gap-2">
                                        <Gift className="w-4 h-4" />
                                        Rewards
                                    </Link>
                                </Button>
                            </>
                        )}

                        {/* Add Earning System link for all users */}
                        {!isLoggedIn && (
                            <Button
                                variant={location.pathname === '/earning-system' ? 'default' : 'ghost'}
                                asChild
                            >
                                <Link to="/earning-system" className="flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    How to Earn
                                </Link>
                            </Button>
                        )}

                        {/* Profile Dropdown Menu when logged in */}
                        {isLoggedIn ? (
                            <div className="relative" ref={dropdownRef}>
                                <Button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    variant="ghost"
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                                >
                                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {getUserInitials(userData?.email)}
                                    </div>
                                    <span className="text-sm text-gray-700 max-w-32 truncate">
                                        {getUserDisplayName()}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                </Button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center text-lg font-medium">
                                                    {getUserInitials(userData?.email)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {getUserDisplayName()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {userData?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <button
                                                onClick={handleDashboard}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-gray-400" />
                                                {userData?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                                            </button>

                                            {userData?.role === 'student' && (
                                                <Link
                                                    to="/rewards"
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Gift className="w-4 h-4 text-gray-400" />
                                                    Rewards
                                                </Link>
                                            )}

                                            <Link
                                                to="/earning-system"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Award className="w-4 h-4 text-gray-400" />
                                                How to Earn
                                            </Link>

                                            <button
                                                onClick={handleSettings}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-gray-400" />
                                                Settings
                                            </button>
                                        </div>

                                        {/* Logout Section */}
                                        <div className="border-t border-gray-100 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant={location.pathname === '/' ? 'default' : 'ghost'}
                                    asChild
                                >
                                    <Link to="/">Home</Link>
                                </Button>
                                <Button onClick={handleLogin} className="bg-black text-white cursor-pointer">
                                    Login
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Renders child routes here */}
            <Outlet />
        </>
    );
}