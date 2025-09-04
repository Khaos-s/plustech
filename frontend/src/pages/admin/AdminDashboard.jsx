import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    TrendingUp,
    TrendingDown,
    Plus,
    Recycle,
    CheckCircle,
    AlertTriangle,
    Clock,
    MoreHorizontal
} from 'lucide-react';

export function AdminDashboard() {
    const dashboardStats = {
        totalStudents: 1234,
        totalStudentsChange: -20,
        activeUsers: 45678,
        activeUsersChange: 12.5,
        totalRecycled: 89567,
        totalRecycledChange: 8.3,
        pointsAwarded: 2450000,
        pointsAwardedChange: 15.2
    };

    const binManagementData = [
        {
            id: 1,
            location: 'Library Main Entrance',
            type: 'Smart Bin',
            status: 'Active',
            capacity: 85,
            target: 90,
            limit: 100,
            reviewer: 'Eddie Lake',
            lastMaintenance: '2 days ago'
        },
        // ... more data
    ];

    const recentActivity = [
        { student: 'Alex Johnson', action: 'Recycled 5 plastic bottles', points: 25, time: '2 min ago', location: 'Library Main' },
        { student: 'Sarah Chen', action: 'Recycled 8 paper items', points: 40, time: '5 min ago', location: 'Student Center' },
        // ... more data
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">PlusTech Dashboard</h1>
                    <p className="text-gray-400">Monitor student engagement and system performance</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Smart Bin
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <span className="text-green-500 text-sm">+{dashboardStats.pointsAwardedChange}%</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{dashboardStats.pointsAwarded.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">Total Points Awarded</div>
                        <div className="text-emerald-500 text-xs mt-1">Strong engagement this month</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-500" />
                                <span className="text-red-500 text-sm">{dashboardStats.totalStudentsChange}%</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{dashboardStats.totalStudents.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">New Students</div>
                        <div className="text-red-400 text-xs mt-1">Registration needs attention</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <span className="text-green-500 text-sm">+{dashboardStats.activeUsersChange}%</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{dashboardStats.activeUsers.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">Active Users</div>
                        <div className="text-emerald-500 text-xs mt-1">Engagement exceeds targets</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <span className="text-green-500 text-sm">+{dashboardStats.totalRecycledChange}%</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{dashboardStats.totalRecycled.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">Items Recycled</div>
                        <div className="text-emerald-500 text-xs mt-1">Steady performance increase</div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <Card className="bg-gray-900 border-gray-800 mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white">System Activity</CardTitle>
                        <p className="text-gray-400 text-sm">Recycling activity for the last 3 months</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-gray-300">
                            Last 3 months
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                            Last 30 days
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                            Last 7 days
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-64 bg-gray-850 rounded-lg flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Activity Chart Placeholder</p>
                            <p className="text-xs">Integration with chart library needed</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-900 rounded-lg flex items-center justify-center">
                                        <Recycle className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{activity.student}</div>
                                        <div className="text-sm text-gray-400">
                                            {activity.action} • {activity.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-400 font-medium">+{activity.points} pts</div>
                                    <div className="text-xs text-gray-400">{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}