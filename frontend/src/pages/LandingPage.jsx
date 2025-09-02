import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// UI Components
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

// Icons
import {
    Recycle,
    Award,
    Users,
    Leaf,
    ArrowRight,
    Sparkles,
    Target,
    TrendingUp,
    Zap,
    User,
    Gift
} from 'lucide-react';

export function LandingPage() {
    const navigate = useNavigate();
    const { isLoggedIn, userData } = useContext(AppContext);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleDashboard = () => {
        if (userData?.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    const handleRewards = () => {
        navigate('/rewards');
    };

    const features = [
        {
            icon: <Zap className="w-10 h-10 text-emerald-500" />,
            title: "Smart Detection",
            description: "AI-powered bins automatically identify and sort your recyclables with 99% accuracy"
        },
        {
            icon: <Award className="w-10 h-10 text-amber-500" />,
            title: "Instant Rewards",
            description: "Earn points immediately and redeem for campus vouchers, discounts, and exclusive perks"
        },
        {
            icon: <Target className="w-10 h-10 text-blue-500" />,
            title: "Impact Tracking",
            description: "See your real-time environmental impact and compete with friends on leaderboards"
        }
    ];

    const stats = [
        { value: "50,247", label: "Items Recycled", trend: "+12%" },
        { value: "2,843", label: "Active Students", trend: "+23%" },
        { value: "89%", label: "Waste Reduced", trend: "+5%" },
        { value: "15", label: "Campus Locations", trend: "+3" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-20 lg:py-20">
                <div className="max-w-7xl mx-auto mb-35">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 -mt-40">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full w-fit">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">Now with AI-Powered Sorting</span>
                            </div>

                            {/* Conditional content based on login status */}
                            {isLoggedIn ? (
                                <>
                                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                        Welcome Back,{' '}
                                        <span className="text-emerald-600">
                                            {userData?.email?.split('@')[0] || 'Eco-Warrior'}
                                        </span>
                                    </h1>

                                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                                        Ready to continue making an impact? Check your dashboard for new rewards
                                        and see how much you've contributed to campus sustainability today.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            onClick={handleDashboard}
                                            size="lg"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6 group"
                                        >
                                            <User className="w-5 h-5 mr-2" />
                                            Go to Dashboard
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        {userData?.role === 'student' && (
                                            <Button
                                                onClick={handleRewards}
                                                variant="outline"
                                                size="lg"
                                                className="text-lg px-8 py-6 border-2 hover:bg-slate-50"
                                            >
                                                <Gift className="w-5 h-5 mr-2" />
                                                View Rewards
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                        Turn Trash Into{' '}
                                        <span className="text-emerald-600">
                                            Treasure
                                        </span>
                                    </h1>

                                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                                        Join the recycling revolution with PLUSTECH's smart bins. Earn instant rewards,
                                        track your environmental impact, and compete with friends while saving the planet.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            onClick={handleRegister}
                                            size="lg"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6 group"
                                        >
                                            Start Earning Now
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button
                                            onClick={handleLogin}
                                            variant="outline"
                                            size="lg"
                                            className="text-lg px-8 py-6 border-2 hover:bg-slate-50"
                                        >
                                            Sign In
                                        </Button>
                                    </div>
                                </>
                            )}

                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 bg-emerald-400 rounded-full border-2 border-white"></div>
                                    <div className="w-10 h-10 bg-blue-400 rounded-full border-2 border-white"></div>
                                    <div className="w-10 h-10 bg-amber-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="text-sm text-slate-600">
                                    <span className="font-semibold">2,843+ students</span> already earning rewards
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative bg-white rounded-3xl p-4 shadow-2xl border ">
                                <img
                                    src="https://images.unsplash.com/photo-1652658379315-9ff6d19d8929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNlYXJjaHwxfHxzbWFydCUyMHJlY3ljbGluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNTYxMDM2MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Smart recycling technology"
                                    className="relative rounded-2xl w-full shadow-lg"
                                />
                                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg">
                                    <Recycle className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Show personalized stats for logged in users */}
                            {isLoggedIn && (
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 border">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="font-bold text-emerald-600">127</div>
                                            <div className="text-xs text-slate-500">Items Recycled</div>
                                        </div>
                                        <div className="w-px h-8 bg-slate-200"></div>
                                        <div className="text-center">
                                            <div className="font-bold text-amber-600">485</div>
                                            <div className="text-xs text-slate-500">Points Earned</div>
                                        </div>
                                        <div className="w-px h-8 bg-slate-200"></div>
                                        <div className="text-center">
                                            <div className="font-bold text-blue-600">#12</div>
                                            <div className="text-xs text-slate-500">Rank</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-emerald-600 font-medium">How It Works</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Recycling Made <span className="text-emerald-600">Rewarding</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Our intelligent system makes sustainable living effortless and rewarding
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <CardContent className="relative p-8">
                                    <div className="mb-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</div>
                                        <div className="text-slate-600 leading-relaxed">{feature.description}</div>
                                    </div>
                                    <div className="w-12 h-1 bg-emerald-500 rounded-full"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 px-4 bg-black text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Real Impact, Real Numbers</h2>
                        <p className="text-xl text-slate-300">See how our community is transforming campus sustainability</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-black bg-opacity-5 rounded-2xl p-8 border border-white border-opacity-10 group-hover:bg-opacity-10 transition-colors duration-300">
                                    <div className="text-4xl lg:text-5xl font-bold text-emerald-400 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-300 mb-3">{stat.label}</div>
                                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{stat.trend}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Conditional based on login status */}
            {isLoggedIn ? (
                <section className="py-24 px-4 bg-emerald-600 text-white relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative">
                        <div className="mb-8">
                            <Award className="w-20 h-20 mx-auto mb-6 opacity-90" />
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                Keep Making an Impact!
                            </h2>
                            <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
                                You're part of the sustainability movement! Continue earning rewards and
                                track your environmental progress with every recycling action.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={handleDashboard}
                                size="lg"
                                variant="secondary"
                                className="bg-white text-emerald-600 hover:bg-slate-50 text-lg px-10 py-6 font-semibold group"
                            >
                                <User className="w-5 h-5 mr-2" />
                                View Dashboard
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            {userData?.role === 'student' && (
                                <Button
                                    onClick={handleRewards}
                                    size="lg"
                                    variant="outline"
                                    className="bg-transparent border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-10 py-6 font-semibold group"
                                >
                                    <Gift className="w-5 h-5 mr-2" />
                                    Check Rewards
                                </Button>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-white opacity-80">
                            <span className="w-2 h-2 bg-white opacity-60 rounded-full"></span>
                            <span className="text-sm">Welcome back, {userData?.email?.split('@')[0]}!</span>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-24 px-4 bg-emerald-600 text-white relative overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center relative">
                        <div className="mb-8">
                            <Leaf className="w-20 h-20 mx-auto mb-6 opacity-90" />
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                Ready to Make an Impact?
                            </h2>
                            <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
                                Join thousands of students who are earning rewards while protecting our planet.
                                Every action counts towards a sustainable future.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                onClick={handleRegister}
                                size="lg"
                                variant="secondary"
                                className="bg-white text-emerald-600 hover:bg-slate-50 text-lg px-10 py-6 font-semibold group"
                            >
                                Start Your Journey
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <div className="flex items-center gap-2 text-white opacity-80">
                                <span className="w-2 h-2 bg-white opacity-60 rounded-full"></span>
                                <span className="text-sm">Free to join • Instant rewards</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}   