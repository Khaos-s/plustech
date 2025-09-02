// controllers/authController.js
import { admin,auth,db  } from '../config/firebase/firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import { getFriendlyErrorMessage } from '../utils/errorMessages.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper to sign JWT for your backend
const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });



// --------------------- REGISTER ---------------------
export const registerController = async (req, res) => {
  const { firstName, lastName, email, password, role, secretCode, RFID, studentId, department,course  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    // 1️⃣ Check role & secret code if admin or OfficeOwner
    let finalRole = 'user';
    if (role === 'admin') {
      if (secretCode === process.env.ADMIN_SECRET_CODE) finalRole = 'admin';
      else return res.status(403).json({ success: false, message: 'Invalid secret code for admin' });
    }

    // 2️⃣ Create user in Firebase Auth   
    const userRecord = await auth.createUser({ email, password });

    // 3️⃣ Assign role via custom claims
    await auth.setCustomUserClaims(userRecord.uid, { role: finalRole, studentId });

    // 4️⃣ Create Firestore document for user profile/stats
    await db.collection("users").doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      studentId,
      role: finalRole,
      RFID: RFID,
      department: department,
      course: course,
      currentStreak: 0,
      level: "Beginner",
      monthlyGoal: 50,
      monthlyProgress: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5️⃣ Issue JWT for your backend session
    const token = signToken({ id: userRecord.uid, role: finalRole, studentId });
    res.cookie('token', token, cookieOptions);

    return res.json({ success: true, message: `${finalRole} account created successfully`, uid: userRecord.uid });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// --------------------- LOGIN ---------------------
export const loginController = async (req, res) => {
  const { email, password, firebaseIdToken } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }
  if (!firebaseIdToken) {
    return res.status(400).json({ success: false, message: "Missing Firebase ID token" });
  }

  try {
    // 1️⃣ Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(firebaseIdToken);
    const { uid, email: userEmail } = decodedToken;

    // 2️⃣ Get user record for claims
    const userRecord = await auth.getUser(uid);
    const role = userRecord.customClaims?.role || "user";

    // 3️⃣ Fetch Firestore profile
    const userDoc = await db.collection("users").doc(uid).get();
    let userData = userDoc.exists ? userDoc.data() : null;

    // 4️⃣ Issue backend JWT
    const token = signToken({ id: uid, role });
    res.cookie("token", token, cookieOptions);

    return res.json({
      success: true,
      message: "Welcome back!",
      user: {
        id: uid,
        email: userEmail,
        role,
        profile: userData, // ← dashboard frontend will use this
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ success: false, message: getFriendlyErrorMessage(err) });
  }
};

// --------------------- LOGOUT ---------------------
export const logoutController = (req, res) => {
  try {
    res.clearCookie('token', { ...cookieOptions, maxAge: undefined });
    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};




