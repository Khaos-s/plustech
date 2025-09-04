import express from "express";
import cors from "cors";
import 'dotenv/config';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import session from "express-session";
import authRouter from './routes/authRoutes.js'; // fixed path
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

dotenv.config();
// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000*60*60*24 }
}));

app.get("/", (req,res) => res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
