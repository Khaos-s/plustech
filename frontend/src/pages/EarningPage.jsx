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
    ArrowLeft,
    CupSoda,
    Newspaper,
    Package,
    Battery,
    Smartphone,
    Coffee,
    ShoppingBag,
    Wine,
    Zap,
    Star,
    Gift,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

export function EarningSystemPage() {
    const navigate = useNavigate();
    const { isLoggedIn, userData } = useContext(AppContext);

    const handleBack = () => {
        navigate('/');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const recyclingCategories = [
        {
            title: "Plastic Bottles",
            icon: <CupSoda className="w-8 h-8 text-blue-500" />,
            color: "blue",
            items: [
                { size: "Small (330ml)", points: 3, examples: "Water bottles, juice boxes" },
                { size: "Medium (500ml-1L)", points: 5, examples: "Soda bottles, sports drinks" },
                { size: "Large (1.5L+)", points: 10, examples: "Family-size bottles, gallon jugs" }
            ]
        },
        {
            title: "Paper & Cardboard",
            icon: <Newspaper className="w-8 h-8 text-amber-500" />,
            color: "amber",
            items: [
                { size: "Newspapers/Magazines", points: 2, examples: "Daily papers, periodicals" },
                { size: "Cardboard Boxes", points: 8, examples: "Shipping boxes, food containers" },
                { size: "Office Paper", points: 4, examples: "Printouts, notebooks, documents" }
            ]
        },
        {
            title: "Metal Cans",
            icon: <Package className="w-8 h-8 text-gray-500" />,
            color: "gray",
            items: [
                { size: "Aluminum Cans", points: 6, examples: "Soda cans, beer cans" },
                { size: "Tin Cans", points: 4, examples: "Food cans, soup cans" },
                { size: "Metal Containers", points: 12, examples: "Large food tins, paint cans" }
            ]
        },
        {
            title: "Glass",
            icon: <Wine className="w-8 h-8 text-green-500" />,
            color: "green",
            items: [
                { size: "Small Jars", points: 7, examples: "Baby food jars, spice containers" },
                { size: "Bottles", points: 9, examples: "Beverage bottles, sauce bottles" },
                { size: "Large Containers", points: 15, examples: "Wine bottles, large pickle jars" }
            ]
        },
        {
            title: "Electronics",
            icon: <Smartphone className="w-8 h-8 text-purple-500" />,
            color: "purple",
            items: [
                { size: "Batteries", points: 20, examples: "AA, AAA, phone batteries" },
                { size: "Small Electronics", points: 50, examples: "Phones, chargers, headphones" },
                { size: "Large Electronics", points: 100, examples: "Laptops, tablets, printers" }
            ]
        },
        {
            title: "Organic Waste",
            icon: <Coffee className="w-8 h-8 text-emerald-500" />,
            color: "emerald",
            items: [
                { size: "Food Scraps", points: 3, examples: "Fruit peels, vegetable waste" },
                { size: "Coffee Grounds", points: 5, examples: "Used coffee, tea bags" },
                { size: "Compostable Items", points: 8, examples: "Biodegradable containers, utensils" }
            ]
        }
    ];

    const bonusRewards = [
        {
            title: "Daily Streak Bonus",
            description: "Recycle every day for a week",
            bonus: "+50 points",
            icon: <Zap className="w-6 h-6 text-yellow-500" />
        },
        {
            title: "Perfect Sort Bonus",
            description: "Correctly sort 10 items in a row",
            bonus: "+25 points",
            icon: <Star className="w-6 h-6 text-blue-500" />
        },
        {
            title: "Monthly Champion",
            description: "Top recycler of the month",
            bonus: "+200 points",
            icon: <Award className="w-6 h-6 text-purple-500" />
        }
    ];

    const rewardTiers = [
        { points: "0-99", tier: "Beginner", color: "gray", benefits: "Basic rewards" },
        { points: "100-299", tier: "Bronze", color: "amber", benefits: "5% discount on campus food" },
        { points: "300-599", tier: "Silver", color: "gray", benefits: "10% discount + free coffee weekly" },
        { points: "600-999", tier: "Gold", color: "yellow", benefits: "15% discount + priority access" },
        { points: "1000+", tier: "Platinum", color: "purple", benefits: "20% discount + exclusive events" }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <Button
                        onClick={handleBack}
                        variant="ghost"
                        className="text-white hover:bg-white hover:bg-opacity-20 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>

                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <Award className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                            Earning System
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Discover how many points you can earn by recycling different items.
                            Every piece counts towards a sustainable campus!
                        </p>
                    </div>
                </div>
            </div>

            {/* How Points Work */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">How Points Work</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Recycle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">1. Drop & Scan</h3>
                            <p className="text-gray-600">Place items in smart bins. AI identifies and sorts automatically.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">2. Instant Points</h3>
                            <p className="text-gray-600">Receive points immediately based on item type and size.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gift className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">3. Redeem Rewards</h3>
                            <p className="text-gray-600">Use points for campus discounts, free items, and exclusive perks.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recycling Categories */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                            Points by Category
                        </h2>
                        <p className="text-xl text-gray-600">
                            Different items earn different points based on their recycling value and environmental impact
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {recyclingCategories.map((category, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-16 h-16 bg-${category.color}-100 rounded-xl flex items-center justify-center`}>
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                                            <p className="text-gray-500">Tap to see point values</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{item.size}</div>
                                                    <div className="text-sm text-gray-500">{item.examples}</div>
                                                </div>
                                                <div className={`text-2xl font-bold text-${category.color}-500 flex items-center gap-1`}>
                                                    {item.points}
                                                    <span className="text-sm text-gray-400">pts</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bonus Rewards */}
            <section className="py-16 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Bonus Rewards
                        </h2>
                        <p className="text-xl opacity-90">
                            Earn extra points with special achievements and consistent recycling
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {bonusRewards.map((bonus, index) => (
                            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300">
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {bonus.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-black">{bonus.title}</h3>
                                <p className="opacity-80 mb-3 text-gray-500">{bonus.description}</p>
                                <div className="text-2xl font-bold text-yellow-300">{bonus.bonus}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reward Tiers */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                            Membership Tiers
                        </h2>
                        <p className="text-xl text-gray-600">
                            Unlock better rewards as you recycle more and climb the tiers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {rewardTiers.map((tier, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
                                <div className={`w-16 h-16 bg-${tier.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <Award className={`w-8 h-8 text-${tier.color}-500`} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{tier.tier}</h3>
                                <p className="text-sm text-gray-500 mb-3">{tier.points} points</p>
                                <p className="text-sm text-gray-600">{tier.benefits}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Calculation */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-emerald-50 rounded-2xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Daily Example
                            </h2>
                            <p className="text-gray-600">
                                See how quickly you can earn points with everyday items
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Morning Routine:</h3>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span>Coffee cup (compostable)</span>
                                    <span className="font-semibold text-emerald-600">+8 pts</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span>Newspaper</span>
                                    <span className="font-semibold text-emerald-600">+2 pts</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span>Plastic water bottle (500ml)</span>
                                    <span className="font-semibold text-emerald-600">+5 pts</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lunch Break:</h3>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span>Aluminum soda can</span>
                                    <span className="font-semibold text-emerald-600">+6 pts</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span>Food packaging (cardboard)</span>
                                    <span className="font-semibold text-emerald-600">+8 pts</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                    <span>Perfect sort bonus</span>
                                    <span className="font-semibold text-purple-600">+25 pts</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8 p-4 bg-emerald-500 text-white rounded-xl">
                            <div className="text-2xl font-bold mb-2">Daily Total: 54 Points!</div>
                            <p>That's enough for a free coffee after just 2 weeks of consistent recycling</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 px-4 bg-emerald-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                        Ready to Start Earning?
                    </h2>
                    <p className="text-xl opacity-90 mb-8">
                        Join thousands of students who are already earning rewards while helping the environment
                    </p>

                    {isLoggedIn ? (
                        <Button
                            onClick={() => navigate('/dashboard')}
                            size="lg"
                            className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold group transition-all duration-200"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={handleRegister}
                                size="lg"
                                className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold group transition-all duration-200"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                onClick={handleLogin}
                                variant="outline"
                                size="lg"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                            >
                                Sign In
                            </Button>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-6 mt-8 text-sm opacity-80">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Average student earns 150+ points/week</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}