// userAuth js
import jwt from 'jsonwebtoken';

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
    req.user = decoded;
    next();
    console.log("Decoded token:", decoded);
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }

  console.log("Cookies received:", req.cookies);
};

export default userAuth;
