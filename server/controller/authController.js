// controllers/authController.js
import { admin, auth, db } from '../config/firebase/firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import { getFriendlyErrorMessage } from '../utils/errorMessages.js';

// 🔑 Helper to sign JWT
const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🍪 Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// --------------------- REGISTER ---------------------
export const registerController = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    secretCode,
    RFID,
    studentId,
    department,
    course,
  } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    // 1️⃣ Role + Secret Code check
    let finalRole = "user";
    if (role === "admin") {
      if (secretCode === process.env.ADMIN_SECRET_CODE) {
        finalRole = "admin";
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Invalid secret code for admin" });
      }
    }

    // 2️⃣ Create Firebase Auth user
    const firebaseUser = await auth.createUser({
      email: email.toLowerCase().trim(),
      password,
      displayName: `${firstName} ${lastName}`,
      emailVerified: false // Start with unverified email
    });

    // 3️⃣ Generate email verification link
    const verificationLink = await auth.generateEmailVerificationLink(email);

    // 4️⃣ Create Firestore user document with additional data
    await db.collection("users").doc(firebaseUser.uid).set({
      uid: firebaseUser.uid,
      firstName: firstName || "",
      lastName: lastName || "",
      email: email.toLowerCase().trim(),
      studentId: studentId || "",
      role: finalRole,
      RFID: RFID || "",
      department: department || "",
      course: course || "",
      emailVerified: false,
      currentStreak: 0,
      level: "Beginner",
      points: 0,
      monthlyGoal: 50,
      monthlyProgress: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({
      success: true,
      message: `Account created successfully! Please check your email (${email}) for verification link before logging in.`,
      uid: firebaseUser.uid,
      emailVerificationRequired: true,
      verificationLink: verificationLink // In production, send this via email
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    
    // Handle Firebase Auth specific errors
    if (err.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        success: false, 
        message: "An account with this email already exists" 
      });
    }
    if (err.code === 'auth/weak-password') {
      return res.status(400).json({ 
        success: false, 
        message: "Password should be at least 6 characters long" 
      });
    }
    if (err.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email address" 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: getFriendlyErrorMessage(err) 
    });
  }
};

// --------------------- LOGIN ---------------------
export const loginController = async (req, res) => {
  const { email, password, firebaseIdToken } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    // If Firebase ID token is provided (from frontend Firebase Auth), verify it
    if (firebaseIdToken) {
      const decodedToken = await auth.verifyIdToken(firebaseIdToken);
      const uid = decodedToken.uid;

      // Get user data from Firestore
      const userDoc = await db.collection("users").doc(uid).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ 
          success: false, 
          message: "User profile not found" 
        });
      }

      const userData = userDoc.data();

      // Get Firebase Auth user to check email verification
      const firebaseUser = await auth.getUser(uid);
      
      if (!firebaseUser.emailVerified) {
        return res.status(403).json({ 
          success: false, 
          message: "Please verify your email before logging in.",
          emailVerificationRequired: true
        });
      }

      // Update email verification status in Firestore if needed
      if (firebaseUser.emailVerified && !userData.emailVerified) {
        await db.collection("users").doc(uid).update({
          emailVerified: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        userData.emailVerified = true;
      }

      // Issue backend JWT
      const token = signToken({ 
        id: uid, 
        role: userData.role,
        email: userData.email 
      });
      res.cookie("token", token, cookieOptions);

      return res.json({
        success: true,
        message: "Welcome back!",
        user: {
          id: uid,
          email: userData.email,
          role: userData.role,
          emailVerified: userData.emailVerified,
          profile: userData,
        },
      });
    }

    // Fallback: If no Firebase ID token, check user exists in Firestore
    const userQuery = await db.collection("users").where("email", "==", email.toLowerCase().trim()).limit(1).get();
    
    if (userQuery.empty) {
      return res.status(404).json({ 
        success: false, 
        message: "No account found with this email address" 
      });
    }

    const userData = userQuery.docs[0].data();
    const uid = userData.uid;

    // Check Firebase Auth user
    const firebaseUser = await auth.getUser(uid);
    
    if (!firebaseUser.emailVerified) {
      return res.status(403).json({ 
        success: false, 
        message: "Please verify your email before logging in. Check your inbox for verification link.",
        emailVerificationRequired: true
      });
    }

    // Note: Since we can't verify password directly with Admin SDK,
    // the frontend should handle Firebase Auth sign-in and send the ID token
    return res.status(400).json({
      success: false,
      message: "Please use the proper authentication flow"
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        success: false, 
        message: "Session expired. Please sign in again." 
      });
    }
    if (err.code === 'auth/id-token-revoked') {
      return res.status(401).json({ 
        success: false, 
        message: "Access revoked. Please sign in again." 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: getFriendlyErrorMessage(err) 
    });
  }
};

// --------------------- VERIFY EMAIL ---------------------
export const verifyEmailController = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ 
      success: false, 
      message: "ID token required" 
    });
  }

  try {
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get Firebase user to check verification status
    const firebaseUser = await auth.getUser(uid);

    if (firebaseUser.emailVerified) {
      // Update Firestore document
      await db.collection("users").doc(uid).update({
        emailVerified: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({
        success: true,
        message: "Email verified successfully! You can now log in."
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email not yet verified. Please check your inbox and click the verification link."
      });
    }

  } catch (error) {
    console.error("❌ Email verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify email"
    });
  }
};

// --------------------- RESEND VERIFICATION ---------------------
export const resendVerificationController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email required" 
    });
  }

  try {
    // Check if user exists in Firestore
    const userDoc = await db.collection("users").where("email", "==", email.toLowerCase().trim()).limit(1).get();
    
    if (userDoc.empty) {
      return res.status(404).json({ 
        success: false, 
        message: "No account found with this email address" 
      });
    }

    // Generate new verification link
    const verificationLink = await auth.generateEmailVerificationLink(email);

    return res.json({
      success: true,
      message: "Verification email sent! Please check your inbox.",
      verificationLink: verificationLink // In production, send via email
    });

  } catch (error) {
    console.error("❌ Resend verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend verification email"
    });
  }
};

// --------------------- LOGOUT ---------------------
export const logoutController = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Clear session if using express-session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Logout failed" 
    });
  }
};

// --------------------- CHECK AUTH STATUS ---------------------
export const checkAuthController = async (req, res) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded?.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    // Get user data from Firestore
    const userDoc = await db.collection("users").doc(decoded.id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userData = userDoc.data();

    // Check if email is still verified in Firebase Auth
    const firebaseUser = await auth.getUser(decoded.id);
    
    if (!firebaseUser.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required',
        emailVerificationRequired: true
      });
    }

    return res.json({
      success: true,
      user: {
        id: userDoc.id,
        email: userData.email,
        role: userData.role,
        emailVerified: userData.emailVerified,
        profile: userData
      }
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};