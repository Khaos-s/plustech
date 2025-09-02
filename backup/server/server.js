import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import session from "express-session";
import authRouter from './routes/authRoutes.js'; // fixed path
import userRouter from "./routes/userRoutes.js";
import dotenv from 'dotenv';
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

// Auth routes
app.use('/api/auth', authRouter);
// user Auth routese
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
