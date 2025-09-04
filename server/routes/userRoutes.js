import express from 'express';
import userAuth from '../middleware/userAuth.js';
import authorizeRole from '../middleware/roleMiddleWare.js';
import { getUserData } from '../controller/user/userController.js';
import { db } from '../config/firebase/firebaseAdmin.js';


const userRouter = express.Router();

// any logged-in by user
userRouter.get('/data', userAuth, getUserData);

// only by admin
userRouter.get('/admin-only', userAuth, authorizeRole('admin'),(req,res)=>{
    res.json({success: true, message: 'Admin route accessed!'});
});

userRouter.get('/me', userAuth, getUserData);
userRouter.get('/me/dashboard',userAuth)


export default userRouter;