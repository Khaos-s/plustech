// pages/admin/RewardsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Gift, Plus, X, Search, AlertCircle, Package, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';
// import { db } from '../../firebase/firebaseConfig';
// import {
//     collection,
//     getDocs,
//     addDoc,
//     query,
//     orderBy,
//     serverTimestamp,
//     updateDoc,
//     doc,
//     deleteDoc
// } from 'firebase/firestore';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

export function AdminRewardsPage() {

    const { backEndUrl } = useContext(AppContext);
    
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [addingReward, setAddingReward] = useState(false);
    const [editingReward, setEditingReward] = useState(null);

    // Form state for adding/editing rewards
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        points: '',
        category: 'Food & Drink',
        status: 'Active',
        quantity: '',
        imageUrl: '',
        terms: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const categories = [
        'Food & Drink',
        'Education',
        'Merchandise',
        'Entertainment',
        'Services',
        'Gift Cards',
        'Electronics',
        'Other'
    ];

    // Fetch rewards from backend only
    const fetchRewards = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backEndUrl}/api/admin/rewards`, { withCredentials: true });
            if (data.success) {
                setRewards(data.rewards);
            } else {
                toast.error(data.message || "Failed to load Rewards Catalog");
            }
        } catch (error) {
            console.error('Error fetching rewards:', error.response?.data || error.message);
            toast.error('Failed to load rewards');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Reward name is required';
        }
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        if (!formData.points || formData.points <= 0) {
            errors.points = 'Points must be greater than 0';
        }
        if (!formData.quantity || formData.quantity < 0) {
            errors.quantity = 'Quantity must be 0 or greater';
        }

        // Check if reward name already exists (only for new rewards)
        if (!editingReward) {
            const nameExists = rewards.some(r => r.name.toLowerCase() === formData.name.toLowerCase());
            if (nameExists) {
                errors.name = 'Reward with this name already exists';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            points: '',
            category: 'Food & Drink',
            status: 'Active',
            quantity: '',
            imageUrl: '',
            terms: ''
        });
        setFormErrors({});
        setEditingReward(null);
    };

    // Open modal for editing
    const handleEditReward = (reward) => {
        setEditingReward(reward);
        setFormData({
            name: reward.name,
            description: reward.description || '',
            points: reward.points.toString(),
            category: reward.category,
            status: reward.status,
            quantity: reward.quantity?.toString() || '0',
            imageUrl: reward.imageUrl || '',
            terms: reward.terms || ''
        });
        setIsModalOpen(true);
    };

    // Add or update reward
    const handleSubmitReward = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setAddingReward(true);
        try {
            const rewardData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                points: parseInt(formData.points) || 0,
                category: formData.category,
                status: formData.status,
                quantity: parseInt(formData.quantity) || 0,
                imageUrl: formData.imageUrl.trim(),
                terms: formData.terms.trim(),
            };

            if (editingReward) {
                await axios.put(`${backEndUrl}/api/admin/rewards/${editingReward.id}`, rewardData, { withCredentials: true });
                toast.success('Reward updated successfully');
            } else {
                await axios.post(`${backEndUrl}/api/admin/rewards`, rewardData, { withCredentials: true });
                toast.success('Reward added successfully');
            }

            resetForm();
            setIsModalOpen(false);
            await fetchRewards();

        } catch (error) {
            console.error('Error saving reward:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to save reward');
        } finally {
            setAddingReward(false);
        }
    };

    // Delete reward
    const handleDeleteReward = async (rewardId) => {
        if (!confirm('Are you sure you want to delete this reward?')) {
            return;
        }

        try {
            // await deleteDoc(doc(db, 'rewards', rewardId));
            await axios.delete(`${backEndUrl}/api/admin/rewards/${rewardId}`, { withCredentials: true });
            toast.success('Reward deleted successfully');
            await fetchRewards();
        } catch (error) {
            console.error('Error deleting reward:', error);
            toast.error('Failed to delete reward');
        }
    };

    // Update reward status
    const updateRewardStatus = async (rewardId, newStatus) => {
        try {
            await axios.put(
                `${backEndUrl}/api/admin/rewards/${rewardId}`,
                { status: newStatus },
                { withCredentials: true }
            );
            toast.success(`Reward status updated to ${newStatus}`);
            await fetchRewards();
        } catch (error) {
            console.error('Error updating reward status:', error.response?.data || error.message);
            toast.error('Failed to update reward status');
        }
    };

    // Filter rewards based on search
    const filteredRewards = rewards.filter(reward =>
        reward.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reward.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Rewards Management</h1>
                    <p className="text-gray-400">Manage rewards catalog and redemptions</p>
                </div>
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reward
                </Button>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="md:col-span-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search rewards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="md:col-span-3 grid grid-cols-3 gap-4">
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-emerald-600">
                                {rewards.filter(r => r.status === 'Active').length}
                            </div>
                            <p className="text-sm text-gray-400">Active Rewards</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">
                                {rewards.reduce((sum, r) => sum + (r.claimedCount || 0), 0)}
                            </div>
                            <p className="text-sm text-gray-400">Total Claims</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {categories.length}
                            </div>
                            <p className="text-sm text-gray-400">Categories</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Rewards Table */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        All Rewards ({filteredRewards.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : filteredRewards.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            {searchTerm ? 'No rewards found matching your search' : 'No rewards found'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left pb-3 text-gray-400">Reward</th>
                                        <th className="text-left pb-3 text-gray-400">Points</th>
                                        <th className="text-left pb-3 text-gray-400">Category</th>
                                        <th className="text-left pb-3 text-gray-400">Quantity</th>
                                        <th className="text-left pb-3 text-gray-400">Status</th>
                                        <th className="text-left pb-3 text-gray-400">Claimed</th>
                                        <th className="text-left pb-3 text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredRewards.map((reward) => (
                                        <tr key={reward.id}>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    {reward.imageUrl ? (
                                                        <img
                                                            src={reward.imageUrl}
                                                            alt={reward.name}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{reward.name}</div>
                                                        <div className="text-sm text-gray-400 truncate max-w-xs">
                                                            {reward.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 font-medium">{reward.points}</td>
                                            <td className="py-4">{reward.category}</td>
                                            <td className="py-4">{reward.quantity}</td>
                                            <td className="py-4">
                                                <Badge
                                                    variant={reward.status === 'Active' ? 'default' : 'secondary'}
                                                    className="cursor-pointer"
                                                    onClick={() => updateRewardStatus(
                                                        reward.id,
                                                        reward.status === 'Active' ? 'Inactive' : 'Active'
                                                    )}
                                                >
                                                    {reward.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4">{reward.claimed} times</td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditReward(reward)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteReward(reward.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Reward Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop:blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-300">
                                        {editingReward ? 'Edit Reward' : 'Add New Reward'}
                                    </h2>
                                    <p className="text-gray-400">
                                        {editingReward ? 'Update reward information' : 'Create a new reward for students'}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmitReward} className="space-y-4">
                                {/* Reward Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-900">Reward Name</Label>
                                    <div className="relative">
                                        <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Coffee Voucher"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`pl-10 ${formErrors.name ? 'border-red-500 text-black' : ''}`}
                                            required
                                            disabled={addingReward}
                                        />
                                    </div>
                                    {formErrors.name && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {formErrors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-900">Description</Label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enjoy a delicious coffee at our campus cafe..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className={`pl-10 min-h-[80px] ${formErrors.description ? 'border-red-500' : ''}`}
                                            required
                                            disabled={addingReward}
                                        />
                                    </div>
                                    {formErrors.description && (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {formErrors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Points and Quantity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="points" className="text-gray-900">Points Required</Label>
                                        <Input
                                            id="points"
                                            name="points"
                                            type="number"
                                            min="1"
                                            placeholder="100"
                                            value={formData.points}
                                            onChange={handleInputChange}
                                            className={formErrors.points ? 'border-red-500' : ''}
                                            required
                                            disabled={addingReward}
                                        />
                                        {formErrors.points && (
                                            <div className="flex items-center text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {formErrors.points}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity" className="text-gray-900">Available Quantity</Label>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            min="0"
                                            placeholder="50"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            className={formErrors.quantity ? 'border-red-500' : ''}
                                            required
                                            disabled={addingReward}
                                        />
                                        {formErrors.quantity && (
                                            <div className="flex items-center text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {formErrors.quantity}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Category and Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-gray-900">Category</Label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={addingReward}
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-gray-900">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={addingReward}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Image URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl" className="text-gray-900">Image URL (Optional)</Label>
                                    <div className="relative">
                                        <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="imageUrl"
                                            name="imageUrl"
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            className="pl-10"
                                            disabled={addingReward}
                                        />
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="space-y-2">
                                    <Label htmlFor="terms" className="text-gray-900">Terms & Conditions (Optional)</Label>
                                    <Textarea
                                        id="terms"
                                        name="terms"
                                        placeholder="Valid for 30 days from redemption date..."
                                        value={formData.terms}
                                        onChange={handleInputChange}
                                        className="min-h-[60px]"
                                        disabled={addingReward}
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            resetForm();
                                        }}
                                        disabled={addingReward}
                                        className="text-gray-600 border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                        disabled={addingReward}
                                    >
                                        {addingReward ? (editingReward ? 'Updating...' : 'Adding...') : (editingReward ? 'Update Reward' : 'Add Reward')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}