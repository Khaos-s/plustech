import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MapPin, Plus } from 'lucide-react';

export function SmartBinsPage() {
    const bins = [
        { id: 1, location: 'Library Main Entrance', status: 'Active', capacity: 85, type: 'Mixed Recycling' },
        { id: 2, location: 'Student Center L2', status: 'Active', capacity: 92, type: 'Paper Only' },
        { id: 3, location: 'Cafeteria East', status: 'Full', capacity: 100, type: 'Plastic Only' },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Smart Bins Management</h1>
                    <p className="text-gray-400">Monitor and manage smart recycling bins</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Smart Bin
                </Button>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        All Smart Bins
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left pb-3 text-gray-400">Location</th>
                                    <th className="text-left pb-3 text-gray-400">Type</th>
                                    <th className="text-left pb-3 text-gray-400">Status</th>
                                    <th className="text-left pb-3 text-gray-400">Capacity</th>
                                    <th className="text-left pb-3 text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {bins.map((bin) => (
                                    <tr key={bin.id}>
                                        <td className="py-4 font-medium">{bin.location}</td>
                                        <td className="py-4 text-gray-400">{bin.type}</td>
                                        <td className="py-4">
                                            <Badge variant={bin.status === 'Active' ? 'default' : 'destructive'}>
                                                {bin.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4">{bin.capacity}%</td>
                                        <td className="py-4">
                                            <Button variant="ghost" size="sm">
                                                Manage
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}