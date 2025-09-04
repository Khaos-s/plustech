// routes/authRoutes.js
import express from 'express';
import { 
  registerController, 
  loginController, 
  logoutController,
  verifyEmailController,
  resendVerificationController,
  checkAuthController
} from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);
authRouter.post('/verify-email', verifyEmailController);
authRouter.post('/resend-verification', resendVerificationController);

// Protected routes
authRouter.get('/is-auth', checkAuthController);
export default authRouter;