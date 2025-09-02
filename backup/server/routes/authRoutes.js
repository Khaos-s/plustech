import express from 'express';
import { registerController, loginController, logoutController } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// Check if user is authenticated
authRouter.get('/is-auth', userAuth, (req, res) => {
  res.json({ success: true, userId: req.userId, role: req.userRole });
});


// Return user data (for frontend AppContext.jsx)
authRouter.get('/user', userAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.userId,
      role: req.userRole,
      email: req.userEmail || null, // if you track email somewhere
    }
  });
});



// Register new user
authRouter.post('/register', registerController);

// Login user
authRouter.post('/login', loginController);
 
// Logout user
authRouter.post('/logout', logoutController);

export default authRouter;
