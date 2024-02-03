import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

/**
 * This function initializes the application.
 * It sets up the server, routes, and middleware.
 * @returns {Object} The initialized application object.
 */

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes go here
import userRouter from './routes/user.route.js';

// Routes declaration
app.use('/api/v1/users', userRouter); // URL: http://localhost:5000/api/v1/users

export default app;
