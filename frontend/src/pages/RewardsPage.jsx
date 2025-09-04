import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
    Gift,
    Star,
    Trophy,
    Coffee,
    ShoppingBag,
    BookOpen,
    Smartphone,
    CheckCircle,
    Clock,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RewardsPage() {
    const navigate = useNavigate();
    const [userPoints] = useState(2450); // This should come from your context/API
    const [redeemedRewards, setRedeemedRewards] = useState([2, 5]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const rewardCategories = [
        { id: 'all', name: 'All Categories', icon: <Gift className="w-4 h-4" /> },
        { id: 'food', name: 'Food & Dining', icon: <Coffee className="w-4 h-4" /> },
        { id: 'shopping', name: 'Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
        { id: 'education', name: 'Education', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'tech', name: 'Technology', icon: <Smartphone className="w-4 h-4" /> },
    ];

    const rewards = [
        {
            id: 1,
            name: "Coffee Shop Voucher",
            description: "$5 off your next purchase at any campus coffee shop",
            points: 250,
            category: "food",
            partner: "Campus Coffee Co",
            availability: "Available",
            expiresIn: "30 days",
            stock: 45
        },
        {
            id: 2,
            name: "Pizza Discount",
            description: "15% off any large pizza order",
            points: 400,
            category: "food",
            partner: "Tony's Pizza",
            availability: "Available",
            expiresIn: "45 days",
            stock: 23
        },
        {
            id: 3,
            name: "Textbook Voucher",
            description: "$15 off any textbook purchase over $50",
            points: 750,
            category: "education",
            partner: "University Bookstore",
            availability: "Available",
            expiresIn: "60 days",
            stock: 12
        },
        {
            id: 4,
            name: "Tech Store Voucher",
            description: "$10 off any purchase over $50",
            points: 800,
            category: "tech",
            partner: "Campus Tech Store",
            availability: "Limited",
            expiresIn: "14 days",
            stock: 5
        },
        {
            id: 5,
            name: "Gym Membership",
            description: "1 month free gym membership",
            points: 1200,
            category: "education",
            partner: "Campus Recreation",
            availability: "Available",
            expiresIn: "45 days",
            stock: 8
        },
        {
            id: 6,
            name: "Movie Ticket",
            description: "Free movie ticket at campus cinema",
            points: 300,
            category: "shopping",
            partner: "Campus Cinema",
            availability: "Available",
            expiresIn: "21 days",
            stock: 34
        },
        {
            id: 7,
            name: "Dining Hall Credit",
            description: "$20 dining hall credit",
            points: 1000,
            category: "food",
            partner: "University Dining",
            availability: "Available",
            expiresIn: "90 days",
            stock: 19
        },
        {
            id: 8,
            name: "Laptop Accessories",
            description: "Free laptop case or wireless mouse pad",
            points: 600,
            category: "tech",
            partner: "Tech Supply Co",
            availability: "Limited",
            expiresIn: "30 days",
            stock: 7
        },
        {
            id: 9,
            name: "Library Study Pass",
            description: "24/7 access to premium study rooms for 1 week",
            points: 350,
            category: "education",
            partner: "University Library",
            availability: "Available",
            expiresIn: "60 days",
            stock: 15
        },
        {
            id: 10,
            name: "Food Court Bundle",
            description: "$25 credit for any food court vendor",
            points: 1250,
            category: "food",
            partner: "Student Union",
            availability: "Available",
            expiresIn: "120 days",
            stock: 11
        }
    ];

    // Filter rewards based on selected category
    const filteredRewards = selectedCategory === 'all'
        ? rewards
        : rewards.filter(reward => reward.category === selectedCategory);

    const myRewards = rewards.filter((reward) =>
        redeemedRewards.includes(reward.id),
    );

    const handleRedeem = (rewardId, points) => {
        if (userPoints >= points && !redeemedRewards.includes(rewardId)) {
            setRedeemedRewards((prev) => [...prev, rewardId]);
            // Here you would typically update the user's points and send to backend
            alert(`Successfully redeemed! You now have ${userPoints - points} points remaining.`);
        }
    };

    const canRedeem = (points, rewardId) => {
        return userPoints >= points && !redeemedRewards.includes(rewardId);
    };

    const getIcon = (category) => {
        switch (category) {
            case "food":
                return <Coffee className="w-8 h-8 text-amber-500" />;
            case "shopping":
                return <ShoppingBag className="w-8 h-8 text-purple-500" />;
            case "education":
                return <BookOpen className="w-8 h-8 text-blue-500" />;
            case "tech":
                return <Smartphone className="w-8 h-8 text-green-500" />;
            default:
                return <Gift className="w-8 h-8 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-blue-50/50">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Header with back button */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-3xl font-bold">
                                <Trophy className="w-8 h-8 text-yellow-300" />
                                {userPoints.toLocaleString()}
                            </div>
                            <div className="text-emerald-100">Available Points</div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Rewards Catalog</h1>
                        <p className="text-emerald-100 text-lg">
                            Redeem your recycling points for amazing rewards from campus partners
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="browse" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 h-12">
                        <TabsTrigger value="browse" className="text-lg">
                            Browse Rewards
                        </TabsTrigger>
                        <TabsTrigger value="my-rewards" className="text-lg">
                            My Rewards ({myRewards.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="browse" className="space-y-6">
                        {/* Category Filter */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Filter by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-3">
                                    {rewardCategories.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm hover:bg-emerald-100 transition-colors"
                                            onClick={() => setSelectedCategory(category.id)}
                                        >
                                            {category.icon}
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rewards Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRewards.map((reward) => (
                                <Card
                                    key={reward.id}
                                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border-b">
                                        {getIcon(reward.category)}
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {reward.name}
                                            </h3>
                                            <Badge
                                                variant={reward.availability === "Limited" ? "destructive" : "secondary"}
                                                className="text-xs"
                                            >
                                                {reward.availability}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {reward.description}
                                        </p>

                                        <div className="space-y-3">
                                            <div className="text-sm text-gray-500">
                                                <strong>Partner:</strong> {reward.partner}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-yellow-500" />
                                                    <span className="font-bold text-lg text-emerald-600">
                                                        {reward.points.toLocaleString()} pts
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {reward.stock} left
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                Expires in {reward.expiresIn}
                                            </div>

                                            {redeemedRewards.includes(reward.id) ? (
                                                <Badge className="w-full justify-center bg-green-500 hover:bg-green-600">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Redeemed
                                                </Badge>
                                            ) : (
                                                <Button
                                                    onClick={() => handleRedeem(reward.id, reward.points)}
                                                    disabled={!canRedeem(reward.points, reward.id)}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300"
                                                >
                                                    {canRedeem(reward.points, reward.id)
                                                        ? "Redeem Now"
                                                        : "Not Enough Points"}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredRewards.length === 0 && (
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-12 text-center">
                                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No rewards found</h3>
                                    <p className="text-gray-600">
                                        Try selecting a different category or check back later for new rewards.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="my-rewards" className="space-y-6">
                        {myRewards.length === 0 ? (
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-12 text-center">
                                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No rewards yet</h3>
                                    <p className="text-gray-600 mb-6">
                                        Start redeeming rewards to see them here. Keep recycling to earn more points!
                                    </p>
                                    <Button
                                        onClick={() => {
                                            const browseTab = document.querySelector('[value="browse"]');
                                            if (browseTab) browseTab.click();
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Browse Rewards
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myRewards.map((reward) => (
                                    <Card
                                        key={reward.id}
                                        className=" shadow-lg overflow-hidden border-2 border-emerald-200"
                                    >
                                        <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                                            {getIcon(reward.category)}
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-lg">
                                                    {reward.name}
                                                </h3>
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Active
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {reward.description}
                                            </p>
                                            <div className="text-sm text-gray-500 mb-4">
                                                <strong>Partner:</strong> {reward.partner}
                                            </div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span className="font-semibold text-emerald-600">
                                                        {reward.points} pts redeemed
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mb-4 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                Expires in {reward.expiresIn}
                                            </div>
                                            <Button
                                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                                onClick={() => alert('Reward code: ' + Math.random().toString(36).substr(2, 9).toUpperCase())}
                                            >
                                                Use Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}