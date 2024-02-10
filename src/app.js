/* eslint-disable no-undef */

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import noteRouter from './routes/note.route.js';
import userRouter from './routes/user.route.js';

/**
 * This function initializes the application.
 * It sets up the server, routes, and middleware.
 * @returns {Object} The initialized application object.
 */

const app = express();
aa;

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes go here

// Routes declaration
app.use('/api/v1/users', userRouter); // URL: http://localhost:5000/api/v1/users
app.use('/api/v1/notes', noteRouter); // URL: http://localhost:5000/api/v1/notes

export default app;
