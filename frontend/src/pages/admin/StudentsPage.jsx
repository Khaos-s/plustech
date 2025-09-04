// pages/admin/StudentsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Users, Plus, Search, X, User, Mail, GraduationCap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../../firebase/firebaseConfig';
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
    updateDoc,
    doc
} from 'firebase/firestore';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';

export function StudentsPage() {
    const { backEndUrl } = useContext(AppContext);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [addingStudent, setAddingStudent] = useState(false);

    // Form state for adding new student
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        department: '',
        course: '',
        RFID: '',
        status: 'Active',
        role: 'user'
    });

    const [formErrors, setFormErrors] = useState({});

    // Fetch students from Firestore
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const studentsData = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                studentsData.push({
                    id: doc.id,
                    ...data,
                    // Calculate points and items from user activity (placeholder for now)
                    points: data.points || 0,
                    items: data.itemsRecycled || 0,
                    joined: data.createdAt?.toDate()?.toLocaleDateString() || 'Unknown'
                });
            });

            setStudents(studentsData);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }
        if (!formData.studentId.trim()) {
            errors.studentId = 'Student ID is required';
        }

        // Check if email or studentId already exists
        const emailExists = students.some(s => s.email.toLowerCase() === formData.email.toLowerCase());
        const studentIdExists = students.some(s => s.studentId === formData.studentId);

        if (emailExists) {
            errors.email = 'Email already exists';
        }
        if (studentIdExists) {
            errors.studentId = 'Student ID already exists';
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

    // Add new student
    const handleAddStudent = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setAddingStudent(true);
        try {
            const studentData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
                studentId: formData.studentId.trim(),
                department: formData.department.trim(),
                course: formData.course.trim(),
                RFID: formData.RFID.trim(),
                status: formData.status,
                role: formData.role,
                points: 0,
                itemsRecycled: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                emailVerified: true // Admin-added students are pre-verified
            };



            await axios.post(`${backEndUrl}/api/admin/students`, studentData, { withCredentials: true });
            toast.success('Student added successfully');
            // const docRef = await addDoc(collection(db, 'users'), studentData);
            // Reset form and close modal
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                studentId: '',
                department: '',
                course: '',
                RFID: '',
                status: 'Active',
                role: 'user'
            });
            setIsModalOpen(false);

            // Refresh students list
            await fetchStudents();

        } catch (error) {
            console.error('Error adding student:', error);
            toast.error('Failed to add student');
        } finally {
            setAddingStudent(false);
        }
    };

    // Filter students based on search
    const filteredStudents = students.filter(student =>
        student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update student status
    const updateStudentStatus = async (studentId, newStatus) => {
        try {
            await updateDoc(doc(db, 'users', studentId), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });

            toast.success(`Student status updated to ${newStatus}`);
            await fetchStudents();
        } catch (error) {
            console.error('Error updating student status:', error);
            toast.error('Failed to update student status');
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Students Management</h1>
                    <p className="text-gray-400">Manage student accounts and track performance</p>
                </div>
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Student
                </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Students Table */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        All Students ({filteredStudents.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            {searchTerm ? 'No students found matching your search' : 'No students found'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left pb-3 text-gray-400">Student</th>
                                        <th className="text-left pb-3 text-gray-400">Student ID</th>
                                        <th className="text-left pb-3 text-gray-400">Points</th>
                                        <th className="text-left pb-3 text-gray-400">Items</th>
                                        <th className="text-left pb-3 text-gray-400">Status</th>
                                        <th className="text-left pb-3 text-gray-400">Joined</th>
                                        <th className="text-left pb-3 text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td className="py-4">
                                                <div>
                                                    <div className="font-medium">
                                                        {student.firstName} {student.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-400">{student.email}</div>
                                                    {student.department && (
                                                        <div className="text-xs text-gray-500">{student.department}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4">{student.studentId}</td>
                                            <td className="py-4">{student.points?.toLocaleString() || 0}</td>
                                            <td className="py-4">{student.items || 0}</td>
                                            <td className="py-4">
                                                <Badge
                                                    variant={student.status === 'Active' ? 'default' : 'secondary'}
                                                    className="cursor-pointer"
                                                    onClick={() => updateStudentStatus(
                                                        student.id,
                                                        student.status === 'Active' ? 'Inactive' : 'Active'
                                                    )}
                                                >
                                                    {student.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-gray-400">{student.joined}</td>
                                            <td className="py-4">
                                                <Button variant="ghost" size="sm">
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Student Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop:blur-lg bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-400">Add New Student</h2>
                                    <p className="text-gray-600">Enter student information to create account</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleAddStudent} className="space-y-4">
                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-gray-100">First Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className={`pl-10 ${formErrors.firstName ? 'border-red-500' : ''}`}
                                                required
                                                disabled={addingStudent}
                                            />
                                        </div>
                                        {formErrors.firstName && (
                                            <div className="flex items-center text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {formErrors.firstName}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-gray-100">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={formErrors.lastName ? 'border-red-500' : ''}
                                            required
                                            disabled={addingStudent}
                                        />
                                        {formErrors.lastName && (
                                            <div className="flex items-center text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {formErrors.lastName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Email and Student ID */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-100">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john.doe@university.edu"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                                                required
                                                disabled={addingStudent}
                                            />
                                        </div>
                                        {formErrors.email && (
                                            <div className="flex items-center text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {formErrors.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="studentId" className="text-gray-100">Student ID</Label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="studentId"
                                                name="studentId"
                                                placeholder="04-2324-09132"
                                                value={formData.studentId}
                                                onChange={handleInputChange}
                                                className={`pl-10 ${formErrors.studentId ? 'border-red-500' : ''}`}
                                                required
                                                disabled={addingStudent}
                                            />
                                        </div>
                                        {formErrors.studentId && (
                                            <div className="flex items-center text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {formErrors.studentId}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Department and Course */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-gray-100">Department</Label>
                                        <Input
                                            id="department"
                                            name="department"
                                            placeholder="CITE"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            disabled={addingStudent}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="course" className="text-gray-100">Course</Label>
                                        <Input
                                            id="course"
                                            name="course"
                                            placeholder="BSIT"
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            disabled={addingStudent}
                                        />
                                    </div>
                                </div>

                                {/* RFID and Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="RFID" className="text-gray-100">RFID</Label>
                                        <Input
                                            id="RFID"
                                            name="RFID"
                                            placeholder="RFID Tag ID"
                                            value={formData.RFID}
                                            onChange={handleInputChange}
                                            disabled={addingStudent}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-gray-100">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                                            disabled={addingStudent}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={addingStudent}
                                        className="text-gray-600 border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                                        disabled={addingStudent}
                                    >
                                        {addingStudent ? 'Adding...' : 'Add Student'}
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