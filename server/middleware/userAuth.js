import jwt from 'jsonwebtoken';

// Middleware to authenticate user
const userAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userEmail = decoded.email || null; // if your JWT contains email
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

export default userAuth;

// Example route using the middleware
import express from 'express';
const router = express.Router();

router.get('/profile', userAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.userId,
      role: req.userRole,
      email: req.userEmail,
    },
  });
});

export { router };
