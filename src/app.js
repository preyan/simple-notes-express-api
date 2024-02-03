import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

/**
 * This function initializes the application.
 * It sets up the server, routes, and middleware.
 * @returns {Object} The initialized application object.
 */

export const init = () => {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(cookieParser());

  return app;
};
