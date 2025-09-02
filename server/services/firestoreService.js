// services/firestoreService.js
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { firestoreDB } from '../firebaseconfig';

// Collection names
const COLLECTIONS = {
  STUDENTS: 'students',
  RECYCLING_ACTIVITIES: 'recyclingActivities',
  ACHIEVEMENTS: 'achievements',
  REWARDS: 'rewards',
  SMART_BINS: 'smartBins'
};

class FirestoreService {
  // Student Profile Methods
  async createStudentProfile(userId, studentData) {
    try {
      const studentRef = doc(firestoreDB, COLLECTIONS.STUDENTS, userId);
      const profileData = {
        userId,
        name: studentData.name,
        studentId: studentData.studentId,
        email: studentData.email,
        totalPoints: 0,
        currentStreak: 0,
        totalItemsRecycled: 0,
        level: 'Green Starter',
        monthlyGoal: 50,
        monthlyProgress: 0,
        weeklyRanking: null,
        impactSaved: {
          co2: 0,
          water: 0,
          energy: 0
        },
        joinedAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
        isActive: true
      };
      
      await updateDoc(studentRef, profileData);
      return { success: true, data: profileData };
    } catch (error) {
      console.error('Error creating student profile:', error);
      throw error;
    }
  }

  async getStudentProfile(userId) {
    try {
      const studentRef = doc(firestoreDB, COLLECTIONS.STUDENTS, userId);
      const studentSnap = await getDoc(studentRef);
      
      if (studentSnap.exists()) {
        return { success: true, data: studentSnap.data() };
      } else {
        return { success: false, message: 'Student profile not found' };
      }
    } catch (error) {
      console.error('Error getting student profile:', error);
      throw error;
    }
  }

  async updateStudentProfile(userId, updateData) {
    try {
      const studentRef = doc(firestoreDB, COLLECTIONS.STUDENTS, userId);
      await updateDoc(studentRef, {
        ...updateData,
        lastActivity: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  }

  // Recycling Activity Methods
  async addRecyclingActivity(userId, activityData) {
    try {
      const activityRef = collection(firestoreDB, COLLECTIONS.RECYCLING_ACTIVITIES);
      const activity = {
        userId,
        itemType: activityData.itemType,
        itemCount: activityData.itemCount,
        pointsEarned: activityData.pointsEarned,
        location: activityData.location,
        binId: activityData.binId,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };

      const docRef = await addDoc(activityRef, activity);

      // Update student's total points and items
      await this.updateStudentStats(userId, {
        totalPoints: increment(activityData.pointsEarned),
        totalItemsRecycled: increment(activityData.itemCount),
        lastActivity: serverTimestamp()
      });

      return { success: true, id: docRef.id, data: activity };
    } catch (error) {
      console.error('Error adding recycling activity:', error);
      throw error;
    }
  }

  async getRecentActivities(userId, limitCount = 10) {
    try {
      const activitiesRef = collection(firestoreDB, COLLECTIONS.RECYCLING_ACTIVITIES);
      const q = query(
        activitiesRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: activities };
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw error;
    }
  }

  async getMonthlyProgress(userId) {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const activitiesRef = collection(firestoreDB, COLLECTIONS.RECYCLING_ACTIVITIES);
      const q = query(
        activitiesRef,
        where('userId', '==', userId),
        where('date', '>=', currentMonth + '-01'),
        where('date', '<=', currentMonth + '-31')
      );
      
      const querySnapshot = await getDocs(q);
      let monthlyItems = 0;
      querySnapshot.forEach((doc) => {
        monthlyItems += doc.data().itemCount;
      });

      return { success: true, data: monthlyItems };
    } catch (error) {
      console.error('Error getting monthly progress:', error);
      throw error;
    }
  }

  // Achievement Methods
  async getUserAchievements(userId) {
    try {
      const achievementsRef = collection(firestoreDB, COLLECTIONS.ACHIEVEMENTS);
      const q = query(achievementsRef, where('userId', '==', userId));
      
      const querySnapshot = await getDocs(q);
      const achievements = [];
      querySnapshot.forEach((doc) => {
        achievements.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: achievements };
    } catch (error) {
      console.error('Error getting user achievements:', error);
      throw error;
    }
  }

  async unlockAchievement(userId, achievementData) {
    try {
      const achievementRef = collection(firestoreDB, COLLECTIONS.ACHIEVEMENTS);
      const achievement = {
        userId,
        name: achievementData.name,
        description: achievementData.description,
        pointsAwarded: achievementData.pointsAwarded,
        unlockedAt: serverTimestamp(),
        category: achievementData.category || 'general'
      };

      const docRef = await addDoc(achievementRef, achievement);

      // Update student's total points
      await this.updateStudentStats(userId, {
        totalPoints: increment(achievementData.pointsAwarded)
      });

      return { success: true, id: docRef.id, data: achievement };
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  // Smart Bins Methods
  async getNearbySmartBins(location, radiusKm = 1) {
    try {
      // For now, we'll get all bins and filter client-side
      // In production, you'd want to use geospatial queries
      const binsRef = collection(firestoreDB, COLLECTIONS.SMART_BINS);
      const querySnapshot = await getDocs(binsRef);
      
      const bins = [];
      querySnapshot.forEach((doc) => {
        bins.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: bins };
    } catch (error) {
      console.error('Error getting nearby smart bins:', error);
      throw error;
    }
  }

  async updateSmartBinStatus(binId, statusData) {
    try {
      const binRef = doc(firestoreDB, COLLECTIONS.SMART_BINS, binId);
      await updateDoc(binRef, {
        ...statusData,
        lastUpdated: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating smart bin status:', error);
      throw error;
    }
  }

  // Helper Methods
  async updateStudentStats(userId, updateData) {
    try {
      const studentRef = doc(firestoreDB, COLLECTIONS.STUDENTS, userId);
      await updateDoc(studentRef, updateData);
    } catch (error) {
      console.error('Error updating student stats:', error);
      throw error;
    }
  }

  // Real-time subscription methods
  subscribeToStudentProfile(userId, callback) {
    const studentRef = doc(firestoreDB, COLLECTIONS.STUDENTS, userId);
    return onSnapshot(studentRef, callback);
  }

  subscribeToRecentActivities(userId, callback, limitCount = 10) {
    const activitiesRef = collection(firestoreDB, COLLECTIONS.RECYCLING_ACTIVITIES);
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    return onSnapshot(q, callback);
  }

  // Leaderboard Methods
  async getWeeklyLeaderboard(limitCount = 50) {
    try {
      const studentsRef = collection(firestoreDB, COLLECTIONS.STUDENTS);
      const q = query(
        studentsRef,
        where('isActive', '==', true),
        orderBy('totalPoints', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const leaderboard = [];
      querySnapshot.forEach((doc, index) => {
        leaderboard.push({ 
          id: doc.id, 
          ...doc.data(),
          rank: index + 1 
        });
      });

      return { success: true, data: leaderboard };
    } catch (error) {
      console.error('Error getting weekly leaderboard:', error);
      throw error;
    }
  }

  async calculateUserRank(userId) {
    try {
      const studentProfile = await this.getStudentProfile(userId);
      if (!studentProfile.success) return { success: false };

      const userPoints = studentProfile.data.totalPoints;
      const studentsRef = collection(firestoreDB, COLLECTIONS.STUDENTS);
      const q = query(
        studentsRef,
        where('totalPoints', '>', userPoints),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const rank = querySnapshot.size + 1;

      return { success: true, data: rank };
    } catch (error) {
      console.error('Error calculating user rank:', error);
      throw error;
    }
  }
}

export default new FirestoreService();