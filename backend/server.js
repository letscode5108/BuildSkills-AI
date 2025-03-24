import express from "express";
import cors from "cors";
import { Router } from "express";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
configDotenv();


// Routes imports
import authRouter from "./Router/auth.router.js";
import userRouter from "./Router/user.router.js";
import learnRouter from "./Router/ailearning.router.js";

// Routes Definitions
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/learn', learnRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})