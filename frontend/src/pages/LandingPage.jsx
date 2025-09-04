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
    Gift,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Shield,
    Heart,
    Globe
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

    const handleEarningSystem = () => {
        navigate('/earning-system');
    };

    const features = [
        {
            icon: <Zap className="w-8 h-8 text-emerald-500" />,
            title: "Smart Detection",
            description: "AI-powered bins automatically identify and sort your recyclables with 99% accuracy"
        },
        {
            icon: <Award className="w-8 h-8 text-amber-500" />,
            title: "Instant Rewards",
            description: "Earn points immediately and redeem for campus vouchers, discounts, and exclusive perks"
        },
        {
            icon: <Target className="w-8 h-8 text-blue-500" />,
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

    const testimonials = [
        {
            name: "Maria Santos",
            role: "Environmental Science Student",
            content: "PLUSTECH made recycling fun and rewarding! I've earned enough points for free meals.",
            avatar: "M"
        },
        {
            name: "John Dela Cruz",
            role: "Computer Science Student",
            content: "The AI sorting is amazing. I love seeing my environmental impact grow every day.",
            avatar: "J"
        },
        {
            name: "Ana Rodriguez",
            role: "Business Administration Student",
            content: "Great way to contribute to sustainability while getting rewards. Highly recommend!",
            avatar: "A"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8 mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm font-medium text-emerald-700">Now with AI-Powered Sorting</span>
                            </div>

                            {isLoggedIn ? (
                                <>
                                    <div className="space-y-6">
                                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
                                            Welcome Back,{' '}
                                            <span className="text-emerald-600 block">
                                                {userData?.firstName || userData?.email?.split('@')[0] || 'Eco-Warrior'}!
                                            </span>
                                        </h1>
                                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                            Ready to continue making an impact? Check your dashboard for new rewards
                                            and see how much you've contributed to campus sustainability.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            onClick={handleDashboard}
                                            size="lg"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold group transition-all duration-200"
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
                                                className="px-8 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50 transition-all duration-200"
                                            >
                                                <Gift className="w-5 h-5 mr-2" />
                                                View Rewards
                                            </Button>
                                        )}
                                    </div>

                                    {/* User Stats */}
                                    <div className="flex items-center gap-8 pt-6 pb-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-emerald-600">127</div>
                                            <div className="text-sm text-gray-500">Items Recycled</div>
                                        </div>
                                        <div className="w-px h-12 bg-gray-200"></div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-amber-600">485</div>
                                            <div className="text-sm text-gray-500">Points Earned</div>
                                        </div>
                                        <div className="w-px h-12 bg-gray-200"></div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">#12</div>
                                            <div className="text-sm text-gray-500">Campus Rank</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
                                            Turn Your Trash Into{' '}
                                            <span className="text-emerald-600 block">
                                                Cash Rewards
                                            </span>
                                        </h1>
                                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                            Join the recycling revolution with PLUSTECH's smart bins. Earn instant rewards,
                                            track your environmental impact, and compete with friends.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            onClick={handleRegister}
                                            size="lg"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold group transition-all duration-200"
                                        >
                                            Start Earning Now
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button
                                            onClick={handleLogin}
                                            variant="outline"
                                            size="lg"
                                            className="px-8 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Sign In
                                        </Button>
                                    </div>

                                    {/* Social Proof */}
                                    <div className="flex items-center gap-6 pt-6">
                                        <div className="flex -space-x-2">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center text-white font-semibold text-sm">M</div>
                                            <div className="w-10 h-10 bg-blue-500 rounded-full border-3 border-white flex items-center justify-center text-white font-semibold text-sm">J</div>
                                            <div className="w-10 h-10 bg-amber-500 rounded-full border-3 border-white flex items-center justify-center text-white font-semibold text-sm">A</div>
                                            <div className="w-10 h-10 bg-purple-500 rounded-full border-3 border-white flex items-center justify-center text-white font-semibold text-sm">+</div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-900">2,843+ students</span> earning rewards daily
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Content - Image */}
                        <div className="relative">
                            <div className="relative">
                                <div className="bg-white rounded-3xl p-4 -mt-15 shadow-2xl mb-0 mt-">
                                    <img
                                        src="https://images.unsplash.com/photo-1652658379315-9ff6d19d8929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHNlYXJjaHwxfHxzbWFydCUyMHJlY3ljbGluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNTYxMDM2MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                        alt="Smart recycling technology"
                                        className="rounded-2xl w-full h-150 object-cover"
                                    />
                                    <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-4 rounded-full shadow-lg">
                                        <Recycle className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-3 border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <Award className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">+25 Points</div>
                                            <div className="text-sm text-gray-500">Plastic bottle recycled</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-6 -left-8 bg-white rounded-xl shadow-lg p-3 border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Leaf className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">2.4 kg CO₂</div>
                                            <div className="text-sm text-gray-500">Saved today</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
                            <span className="text-emerald-600 font-semibold">How It Works</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                            Recycling Made <span className="text-emerald-600">Simple & Rewarding</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our intelligent system makes sustainable living effortless and instantly rewarding
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    <div className="w-12 h-1 bg-emerald-500 rounded-full mt-6"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* CTA for Earning System */}
                    <div className="text-center mt-16">
                        <Button
                            onClick={handleEarningSystem}
                            size="lg"
                            variant="outline"
                            className="px-8 py-3 rounded-xl font-semibold border-2 hover:bg-emerald-50 border-emerald-200 text-emerald-600 group transition-all duration-200"
                        >
                            See How You Earn Points
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Real Impact, Real Numbers</h2>
                        <p className="text-xl text-gray-300">See how our community is transforming campus sustainability</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-gray-800 rounded-2xl p-8 group-hover:bg-gray-700 transition-colors duration-300">
                                    <div className="text-4xl lg:text-5xl font-bold text-emerald-400 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-300 mb-3">{stat.label}</div>
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

            {/* Testimonials Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">What Students Say</h2>
                        <p className="text-xl text-gray-600">Join thousands who are already making a difference</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-0 shadow-lg bg-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed italic">"{testimonial.content}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {isLoggedIn ? (
                <section className="py-20 px-4 bg-emerald-600 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Keep Making an Impact!
                        </h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            You're part of the sustainability movement! Continue earning rewards and
                            track your environmental progress.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={handleDashboard}
                                size="lg"
                                className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold group transition-all duration-200"
                            >
                                <User className="w-5 h-5 mr-2" />
                                View Dashboard
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            {userData?.role === 'student' && (
                                <Button
                                    onClick={handleRewards}
                                    variant="outline"
                                    size="lg"
                                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                                >
                                    <Gift className="w-5 h-5 mr-2" />
                                    Check Rewards
                                </Button>
                            )}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-20 px-4 bg-emerald-600 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <Leaf className="w-16 h-16 mx-auto mb-6 opacity-90" />
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Make an Impact?
                        </h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Join thousands of students earning rewards while protecting our planet.
                            Every action counts towards a sustainable future.
                        </p>

                        <Button
                            onClick={handleRegister}
                            size="lg"
                            className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold group transition-all duration-200"
                        >
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <div className="flex items-center justify-center gap-2 mt-6 opacity-80">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">Free to join • Instant rewards • Secure platform</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Recycle className="w-8 h-8 text-emerald-500" />
                                <h3 className="text-2xl font-bold">PLUSTECH</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Making recycling rewarding and sustainable campus living achievable for every student.
                            </p>
                            <div className="flex gap-4">
                                <Facebook className="w-6 h-6 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
                                <Twitter className="w-6 h-6 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
                                <Instagram className="w-6 h-6 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors" />
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                            <div className="space-y-3">
                                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">How It Works</div>
                                <div
                                    onClick={handleEarningSystem}
                                    className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                                >
                                    Earning System
                                </div>
                                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Campus Locations</div>
                                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">FAQ</div>
                            </div>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Support</h4>
                            <div className="space-y-3">
                                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Help Center</div>
                                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Contact Us</div>
                                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</div>
                                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Contact</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                    <span>support@plustech.edu</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Phone className="w-5 h-5" />
                                    <span>(+63) 123-456-7890</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <MapPin className="w-5 h-5" />
                                    <span>Iloilo City, Philippines</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm">
                            © 2025 PLUSTECH. All rights reserved.
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-4 md:mt-0">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span>Made for a sustainable future</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}