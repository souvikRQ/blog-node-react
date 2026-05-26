import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middleware/error.middleware.js';
import authRouter from './modules/auth/auth.router.js';
import blogRouter from './modules/blogs/blog.router.js';
import commentRouter from './modules/comments/comment.router.js';
import healthRouter from './modules/health/health.router.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes registration
app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/comments', commentRouter);
app.use('/api/health', healthRouter);

// Catch-all route handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler middleware
app.use(errorMiddleware);

export default app;
