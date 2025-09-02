// controllers/authController.js
import { auth } from '../config/firebase/firebaseAdmin.js';
import jwt from 'jsonwebtoken';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper to sign JWT for your backend
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });



// --------------------- REGISTER ---------------------
export const registerController = async (req, res) => {
  const {studentId, email, password, role, secretCode,  } = req.body;

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
    await auth.setCustomUserClaims(userRecord.uid, { role: finalRole });

    // 4️⃣ Issue JWT for your backend session
    const token = signToken({ id: userRecord.uid, role: finalRole });
    res.cookie('token', token, cookieOptions);

    return res.json({ success: true, message: `${finalRole} account created successfully`, uid: userRecord.uid });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------- LOGIN ---------------------
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    // 1️⃣ Sign in with Firebase Admin SDK requires verifying email/password via client SDK.
    // Here, backend trusts frontend Firebase token or uses a custom approach.
    // For simplicity, we will assume frontend sends Firebase ID token:
    const { firebaseIdToken } = req.body; // Frontend should send this
    if (!firebaseIdToken) return res.status(400).json({ success: false, message: 'Firebase ID token required' });

    // 2️⃣ Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(firebaseIdToken);
    const { uid, role } = decodedToken;

    // 3️⃣ Issue your own JWT for backend session
    const token = signToken({ id: uid, role });
    res.cookie('token', token, cookieOptions);

    // 4️⃣ Return user info
    return res.json({
      success: true,
      message: 'Login successful',
      user: { id: uid, email: decodedToken.email, role },
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
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
