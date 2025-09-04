// routes/adminRoutes.js
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { db } from '../config/firebase/firebaseAdmin.js';

const adminRouter = express.Router();

// Middleware to ensure only admins can access these routes
adminRouter.use(userAuth, authorizeRole('admin'));

// ============= STUDENTS MANAGEMENT =============

// Get all students
adminRouter.get('/students', async (req, res) => {
    try {
        const studentsSnapshot = await db.collection('users').get();
        const students = [];
        
        studentsSnapshot.forEach(doc => {
            const data = doc.data();
            students.push({
                id: doc.id,
                ...data,
                // Don't send sensitive data
                password: undefined,
                secretCode: undefined
            });
        });

        res.json({
            success: true,
            students: students.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students'
        });
    }
});

// Add new student (admin-created)
adminRouter.post('/students', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            studentId,
            department,
            course,
            RFID,
            status = 'Active',
            role = 'user'
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !studentId) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, email, and student ID are required'
            });
        }

        // Check if email or studentId already exists
        const [emailCheck, studentIdCheck] = await Promise.all([
            db.collection('users').where('email', '==', email.toLowerCase()).get(),
            db.collection('users').where('studentId', '==', studentId).get()
        ]);

        if (!emailCheck.empty) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        if (!studentIdCheck.empty) {
            return res.status(400).json({
                success: false,
                message: 'Student ID already exists'
            });
        }

        // Create student document
        const studentData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            studentId: studentId.trim(),
            department: department?.trim() || '',
            course: course?.trim() || '',
            RFID: RFID?.trim() || '',
            status,
            role,
            points: 0,
            itemsRecycled: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            emailVerified: true, // Admin-created students are pre-verified
            createdBy: 'admin',
            adminCreated: true
        };

        const docRef = await db.collection('users').add(studentData);

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            studentId: docRef.id
        });

    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add student'
        });
    }
});

// Update student
adminRouter.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove sensitive fields that shouldn't be updated
        delete updates.password;
        delete updates.id;
        delete updates.createdAt;

        updates.updatedAt = new Date();

        await db.collection('users').doc(id).update(updates);

        res.json({
            success: true,
            message: 'Student updated successfully'
        });

    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update student'
        });
    }
});

// Delete student
adminRouter.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await db.collection('users').doc(id).delete();

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete student'
        });
    }
});

// ============= REWARDS MANAGEMENT =============

// Get all rewards
adminRouter.get('/rewards', async (req, res) => {
    try {
        const rewardsSnapshot = await db.collection('rewards').orderBy('createdAt', 'desc').get();
        const rewards = [];
        
        rewardsSnapshot.forEach(doc => {
            rewards.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            rewards
        });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch rewards'
        });
    }
});

// Add new reward
adminRouter.post('/rewards', async (req, res) => {
    try {
        const {
            name,
            description,
            points,
            category,
            quantity,
            imageUrl,
            terms,
            status = 'Active'
        } = req.body;

        // Validate required fields
        if (!name || !description || !points || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, points, and category are required'
            });
        }

        if (points <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Points must be greater than 0'
            });
        }

        // Check if reward name already exists
        const nameCheck = await db.collection('rewards').where('name', '==', name.trim()).get();
        if (!nameCheck.empty) {
            return res.status(400).json({
                success: false,
                message: 'Reward with this name already exists'
            });
        }

        const rewardData = {
            name: name.trim(),
            description: description.trim(),
            points: parseInt(points),
            category: category.trim(),
            quantity: parseInt(quantity) || 0,
            imageUrl: imageUrl?.trim() || '',
            terms: terms?.trim() || '',
            status,
            claimedCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: req.user.id
        };

        const docRef = await db.collection('rewards').add(rewardData);

        res.status(201).json({
            success: true,
            message: 'Reward added successfully',
            rewardId: docRef.id
        });

    } catch (error) {
        console.error('Error adding reward:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add reward'
        });
    }
});

// Update reward
adminRouter.put('/rewards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated
        delete updates.id;
        delete updates.createdAt;
        delete updates.claimedCount;

        updates.updatedAt = new Date();

        await db.collection('rewards').doc(id).update(updates);

        res.json({
            success: true,
            message: 'Reward updated successfully'
        });

    } catch (error) {
        console.error('Error updating reward:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update reward'
        });
    }
});

// Delete reward
adminRouter.delete('/rewards/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if reward has been claimed
        const claimsSnapshot = await db.collection('rewardClaims')
            .where('rewardId', '==', id)
            .limit(1)
            .get();

        if (!claimsSnapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete reward that has been claimed by users'
            });
        }

        await db.collection('rewards').doc(id).delete();

        res.json({
            success: true,
            message: 'Reward deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting reward:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete reward'
        });
    }
});

// Get reward claims/redemptions
adminRouter.get('/rewards/:id/claims', async (req, res) => {
    try {
        const { id } = req.params;

        const claimsSnapshot = await db.collection('rewardClaims')
            .where('rewardId', '==', id)
            .orderBy('claimedAt', 'desc')
            .get();

        const claims = [];
        claimsSnapshot.forEach(doc => {
            claims.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            claims
        });

    } catch (error) {
        console.error('Error fetching reward claims:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reward claims'
        });
    }
});

// Get all reward claims
adminRouter.get('/claims', async (req, res) => {
    try {
        const claimsSnapshot = await db.collection('rewardClaims')
            .orderBy('claimedAt', 'desc')
            .get();

        const claims = [];
        for (const doc of claimsSnapshot.docs) {
            const claimData = doc.data();
            
            // Get user and reward details
            const [userDoc, rewardDoc] = await Promise.all([
                db.collection('users').doc(claimData.userId).get(),
                db.collection('rewards').doc(claimData.rewardId).get()
            ]);

            claims.push({
                id: doc.id,
                ...claimData,
                user: userDoc.exists ? userDoc.data() : null,
                reward: rewardDoc.exists ? rewardDoc.data() : null
            });
        }

        res.json({
            success: true,
            claims
        });

    } catch (error) {
        console.error('Error fetching all claims:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch claims'
        });
    }
});

// Update claim status (approve/reject)
adminRouter.put('/claims/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved, rejected, or pending'
            });
        }

        const updates = {
            status,
            adminNotes: adminNotes || '',
            reviewedAt: new Date(),
            reviewedBy: req.user.id
        };

        await db.collection('rewardClaims').doc(id).update(updates);

        res.json({
            success: true,
            message: `Claim ${status} successfully`
        });

    } catch (error) {
        console.error('Error updating claim:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update claim'
        });
    }
});

// ============= ANALYTICS =============

// Get dashboard analytics
adminRouter.get('/analytics/dashboard', async (req, res) => {
    try {
        // Get counts
        const [usersSnapshot, rewardsSnapshot, claimsSnapshot] = await Promise.all([
            db.collection('users').get(),
            db.collection('rewards').get(),
            db.collection('rewardClaims').get()
        ]);

        const totalUsers = usersSnapshot.size;
        const activeUsers = usersSnapshot.docs.filter(doc => doc.data().status === 'Active').length;
        const totalRewards = rewardsSnapshot.size;
        const activeRewards = rewardsSnapshot.docs.filter(doc => doc.data().status === 'Active').length;
        const totalClaims = claimsSnapshot.size;
        
        // Calculate total points distributed
        const totalPointsDistributed = usersSnapshot.docs.reduce((sum, doc) => {
            return sum + (doc.data().points || 0);
        }, 0);

        // Calculate total items recycled
        const totalItemsRecycled = usersSnapshot.docs.reduce((sum, doc) => {
            return sum + (doc.data().itemsRecycled || 0);
        }, 0);

        // Get recent activities
        const recentUsers = usersSnapshot.docs
            .sort((a, b) => new Date(b.data().createdAt) - new Date(a.data().createdAt))
            .slice(0, 5)
            .map(doc => ({
                id: doc.id,
                name: `${doc.data().firstName} ${doc.data().lastName}`,
                email: doc.data().email,
                createdAt: doc.data().createdAt
            }));

        const recentClaims = claimsSnapshot.docs
            .sort((a, b) => new Date(b.data().claimedAt) - new Date(a.data().claimedAt))
            .slice(0, 5)
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        res.json({
            success: true,
            analytics: {
                overview: {
                    totalUsers,
                    activeUsers,
                    totalRewards,
                    activeRewards,
                    totalClaims,
                    totalPointsDistributed,
                    totalItemsRecycled
                },
                recent: {
                    users: recentUsers,
                    claims: recentClaims
                }
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics'
        });
    }
});

export default adminRouter;