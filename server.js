// server.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from "./routes/aiRoutes.js";
import { connectCloudinary } from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';


const app = express();

await connectCloudinary()

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Basic test route
app.get('/', (req, res) => {res.send('Server is Live!');});

app.use(requireAuth())

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

// Port setup from .env or default 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
