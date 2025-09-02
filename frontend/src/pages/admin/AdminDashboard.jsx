import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    Recycle,
    MapPin,
    AlertTriangle,
    Settings,
    Activity,
    Award
} from 'lucide-react';

export function AdminDashboard() {
    // Mock data - in real app, this would come from API
    const systemStats = {
        totalStudents: 2543,
        activeToday: 156,
        totalBins: 15,
        activeBins: 14,
        itemsToday: 342,
        itemsThisMonth: 8756,
        pointsAwarded: 43780,
        rewardsRedeemed: 287
    };

    const weeklyData = [
        { day: 'Mon', items: 245, students: 89 },
        { day: 'Tue', items: 312, students: 124 },
        { day: 'Wed', items: 278, students: 98 },
        { day: 'Thu', items: 356, students: 142 },
        { day: 'Fri', items: 423, students: 178 },
        { day: 'Sat', items: 189, students: 67 },
        { day: 'Sun', items: 134, students: 45 }
    ];

    const materialData = [
        { name: 'Plastic Bottles', value: 35, color: '#8884d8' },
        { name: 'Aluminum Cans', value: 28, color: '#82ca9d' },
        { name: 'Paper', value: 22, color: '#ffc658' },
        { name: 'Glass', value: 10, color: '#ff7300' },
        { name: 'Other', value: 5, color: '#00ff88' }
    ];

    const binLocations = [
        { name: 'Library Main', capacity: 85, status: 'Normal', itemsToday: 45, lastCollection: '2 hours ago' },
        { name: 'Student Center L2', capacity: 92, status: 'Normal', itemsToday: 38, lastCollection: '4 hours ago' },
        { name: 'Cafeteria East', capacity: 100, status: 'Full', itemsToday: 67, lastCollection: '8 hours ago' },
        { name: 'Dormitory A', capacity: 67, status: 'Normal', itemsToday: 23, lastCollection: '1 hour ago' },
        { name: 'Recreation Center', capacity: 78, status: 'Normal', itemsToday: 34, lastCollection: '3 hours ago' },
        { name: 'Engineering Building', capacity: 43, status: 'Low', itemsToday: 12, lastCollection: '6 hours ago' },
        { name: 'Business School', capacity: 89, status: 'Normal', itemsToday: 56, lastCollection: '5 hours ago' },
        { name: 'Science Complex', capacity: 91, status: 'Normal', itemsToday: 41, lastCollection: '2 hours ago' }
    ];

    const recentAlerts = [
        { type: 'full', location: 'Cafeteria East', time: '15 minutes ago', severity: 'high' },
        { type: 'maintenance', location: 'Library Main', time: '2 hours ago', severity: 'medium' },
        { type: 'low', location: 'Engineering Building', time: '4 hours ago', severity: 'low' }
    ];

    const topStudents = [
        { name: 'Sarah Chen', points: 3450, items: 142, streak: 21 },
        { name: 'Mike Johnson', points: 2890, items: 118, streak: 15 },
        { name: 'Emma Davis', points: 2650, items: 106, streak: 18 },
        { name: 'Alex Rodriguez', points: 2450, items: 98, streak: 12 },
        { name: 'Lisa Park', points: 2340, items: 89, streak: 9 }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Full': return 'destructive';
            case 'Low': return 'secondary';
            case 'Normal': return 'default';
            default: return 'default';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'full': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'maintenance': return <Settings className="w-4 h-4 text-yellow-500" />;
            case 'low': return <Activity className="w-4 h-4 text-blue-500" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-6 rounded-xl">
                <h1 className="text-2xl mb-2">PLUSTECH Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor and manage your smart bin recycling network across campus
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                        <div className="text-2xl mb-1">{systemStats.totalStudents.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Students</div>
                        <div className="text-xs text-green-600 mt-1">
                            +{systemStats.activeToday} active today
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <Recycle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                        <div className="text-2xl mb-1">{systemStats.itemsThisMonth.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Items This Month</div>
                        <div className="text-xs text-green-600 mt-1">
                            +{systemStats.itemsToday} today
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <MapPin className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                        <div className="text-2xl mb-1">{systemStats.activeBins}/{systemStats.totalBins}</div>
                        <div className="text-sm text-muted-foreground">Active Bins</div>
                        <div className="text-xs text-green-600 mt-1">
                            {((systemStats.activeBins / systemStats.totalBins) * 100).toFixed(1)}% operational
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 text-center">
                        <Award className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                        <div className="text-2xl mb-1">{systemStats.pointsAwarded.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Points Awarded</div>
                        <div className="text-xs text-green-600 mt-1">
                            {systemStats.rewardsRedeemed} rewards redeemed
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bins">Bin Management</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Tabs content here... same as your code */}
            </Tabs>
        </div>
    );
}
