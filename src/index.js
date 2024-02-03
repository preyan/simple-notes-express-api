/**
 * This file serves as the entry point of the application.
 * It imports the necessary modules, configures the environment variables,
 * and establishes a connection to the database.
 */
import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config({
  path: '.env',
});

connectDB();
