import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
    Trophy,
    Recycle,
    TrendingUp,
    Leaf,
    Star,
    Gift,
    QrCode,
    Award,
    MapPin,
    Calendar,
    Target,
    Zap
} from 'lucide-react';

export function StudentDashboard() {
    const navigate = useNavigate();
    const [showQR, setShowQR] = useState(false);

    const studentData = {
        name: "Alex Johnson",
        studentId: "ST123456",
        totalPoints: 2450,
        currentStreak: 7,
        totalItemsRecycled: 89,
        nextRewardAt: 2500,
        level: "Green Champion",
        monthlyGoal: 100,
        monthlyProgress: 67,
        weeklyRanking: 15,
        impactSaved: {
            co2: "12.5 kg",
            water: "450 L",
            energy: "25 kWh"
        }
    };

    const recentActivity = [
        {
            date: 'Today',
            items: 5,
            points: 25,
            type: 'Plastic Bottles',
            location: 'Library Main',
            time: '2:30 PM',
            icon: <Recycle className="w-5 h-5" />
        },
        {
            date: 'Yesterday',
            items: 8,
            points: 40,
            type: 'Paper',
            location: 'Student Center',
            time: '11:45 AM',
            icon: <Recycle className="w-5 h-5" />
        },
        {
            date: '2 days ago',
            items: 3,
            points: 15,
            type: 'Aluminum Cans',
            location: 'Cafeteria East',
            time: '1:15 PM',
            icon: <Recycle className="w-5 h-5" />
        },
        {
            date: '3 days ago',
            items: 12,
            points: 60,
            type: 'Mixed Items',
            location: 'Dormitory A',
            time: '4:20 PM',
            icon: <Recycle className="w-5 h-5" />
        }
    ];

    const achievements = [
        { name: 'First Steps', description: 'Completed your first recycling', earned: true, points: 50 },
        { name: 'Streak Master', description: '7-day recycling streak', earned: true, points: 100 },
        { name: 'Paper Champion', description: '50 paper items recycled', earned: true, points: 75 },
        { name: 'Plastic Warrior', description: '100 plastic items (Progress: 45/100)', earned: false, points: 150 },
        { name: 'Green Guardian', description: '200 total items (Progress: 89/200)', earned: false, points: 200 },
        { name: 'Eco Legend', description: 'Reach 5000 points', earned: false, points: 500 }
    ];

    const nearbyBins = [
        {
            name: 'Library Main Entrance',
            distance: '50m',
            status: 'Available',
            capacity: 85,
            walkTime: '1 min',
            types: ['Paper', 'Plastic', 'Metal']
        },
        {
            name: 'Student Center L2',
            distance: '120m',
            status: 'Available',
            capacity: 92,
            walkTime: '2 min',
            types: ['All Types']
        },
        {
            name: 'Cafeteria East',
            distance: '200m',
            status: 'Full',
            capacity: 100,
            walkTime: '3 min',
            types: ['Organic', 'Plastic']
        },
        {
            name: 'Dormitory A Lobby',
            distance: '350m',
            status: 'Available',
            capacity: 67,
            walkTime: '5 min',
            types: ['Paper', 'Metal']
        }
    ];

    const pointsToNextReward = studentData.nextRewardAt - studentData.totalPoints;
    const progressPercentage = (studentData.totalPoints / studentData.nextRewardAt) * 100;

    const handleNavigateToRewards = () => {
        navigate('/rewards');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-blue-50/50">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 rounded-2xl shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {studentData.name}!</h1>
                            <p className="text-emerald-100 mb-4 text-lg">
                                You're making a real difference! Keep up the great work protecting our environment.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                                    <Trophy className="w-4 h-4 mr-2" />
                                    {studentData.level}
                                </Badge>
                                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                                    <Target className="w-4 h-4 mr-2" />
                                    Rank #{studentData.weeklyRanking} This Week
                                </Badge>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowQR(!showQR)}
                            variant="secondary"
                            size="lg"
                            className="flex items-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50"
                        >
                            <QrCode className="w-5 h-5" />
                            {showQR ? 'Hide QR Code' : 'Show QR Code'}
                        </Button>
                    </div>
                </div>

                {/* QR Code Display */}
                {showQR && (
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-64 h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mx-auto mb-6 flex items-center justify-center border-4 border-emerald-200">
                                    <div className="text-center">
                                        <QrCode className="w-32 h-32 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-sm font-mono text-emerald-700">ID: {studentData.studentId}</div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Your Personal QR Code</h3>
                                <p className="text-slate-600">
                                    Scan this at any PLUSTECH smart bin to start recycling and earning points instantly
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Trophy className="w-10 h-10 text-amber-500" />
                                <span className="text-2xl font-bold">{studentData.totalPoints.toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-slate-600 font-medium">Total Points Earned</div>
                            <div className="text-xs text-emerald-600 mt-1">+170 this week</div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Recycle className="w-10 h-10 text-emerald-500" />
                                <span className="text-2xl font-bold">{studentData.totalItemsRecycled}</span>
                            </div>
                            <div className="text-sm text-slate-600 font-medium">Items Recycled</div>
                            <div className="text-xs text-emerald-600 mt-1">+28 this month</div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Zap className="w-10 h-10 text-orange-500" />
                                <span className="text-2xl font-bold">{studentData.currentStreak}</span>
                            </div>
                            <div className="text-sm text-slate-600 font-medium">Day Streak</div>
                            <div className="text-xs text-orange-600 mt-1">Keep it up!</div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Gift className="w-10 h-10 text-purple-500" />
                                <span className="text-2xl font-bold">{pointsToNextReward}</span>
                            </div>
                            <div className="text-sm text-slate-600 font-medium">Points to Next Reward</div>
                            <div className="text-xs text-purple-600 mt-1">So close!</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Section */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-500" />
                                Reward Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{studentData.totalPoints} points</span>
                                <span>{studentData.nextRewardAt} points</span>
                            </div>
                            <Progress value={progressPercentage} className="h-3" />
                            <p className="text-sm text-slate-600">
                                Just <span className="font-semibold text-emerald-600">{pointsToNextReward} more points</span> to unlock your next reward!
                            </p>
                            <Button onClick={handleNavigateToRewards} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                Browse Rewards Catalog
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Leaf className="w-5 h-5 text-emerald-500" />
                                Environmental Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-emerald-50 p-3 rounded-lg">
                                    <div className="font-bold text-emerald-700">{studentData.impactSaved.co2}</div>
                                    <div className="text-xs text-emerald-600">CO₂ Saved</div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="font-bold text-blue-700">{studentData.impactSaved.water}</div>
                                    <div className="text-xs text-blue-600">Water Saved</div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-lg">
                                    <div className="font-bold text-amber-700">{studentData.impactSaved.energy}</div>
                                    <div className="text-xs text-amber-600">Energy Saved</div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 text-center">
                                Your recycling efforts are making a real difference!
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="activity" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 h-12">
                        <TabsTrigger value="activity" className="text-sm">Recent Activity</TabsTrigger>
                        <TabsTrigger value="achievements" className="text-sm">Achievements</TabsTrigger>
                        <TabsTrigger value="nearby" className="text-sm">Smart Bins</TabsTrigger>
                    </TabsList>

                    <TabsContent value="activity" className="space-y-4">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    Recent Recycling Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                    {activity.icon}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{activity.type}</div>
                                                    <div className="text-sm text-slate-600">
                                                        {activity.items} items • {activity.location} • {activity.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-emerald-600">+{activity.points}</div>
                                                <div className="text-sm text-slate-500">{activity.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="achievements" className="space-y-4">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-purple-500" />
                                    Your Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {achievements.map((achievement, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-xl border-2 transition-all ${achievement.earned
                                                ? 'bg-emerald-50 border-emerald-200 shadow-md'
                                                : 'bg-slate-50 border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.earned
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-300 text-slate-500'
                                                    }`}>
                                                    <Award className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-semibold ${achievement.earned ? 'text-slate-900' : 'text-slate-500'
                                                        }`}>
                                                        {achievement.name}
                                                    </div>
                                                    <div className="text-sm text-slate-600 mb-1">
                                                        {achievement.description}
                                                    </div>
                                                    <div className="text-xs text-emerald-600 font-medium">
                                                        {achievement.points} points
                                                    </div>
                                                </div>
                                                {achievement.earned && (
                                                    <Badge className="bg-emerald-500">
                                                        ✓ Earned
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="nearby" className="space-y-4">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-red-500" />
                                    Nearby Smart Bins
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {nearbyBins.map((bin, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <MapPin className="w-6 h-6 text-slate-500" />
                                                <div>
                                                    <div className="font-semibold">{bin.name}</div>
                                                    <div className="text-sm text-slate-600">
                                                        {bin.distance} away • {bin.walkTime} walk
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">
                                                        Accepts: {bin.types.join(', ')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={bin.status === 'Available' ? 'default' : 'destructive'}
                                                    className="mb-2"
                                                >
                                                    {bin.status}
                                                </Badge>
                                                <div className="text-sm text-slate-600">
                                                    {bin.capacity}% full
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}