/* eslint-disable no-undef */

/**
 * This file serves as the entry point of the application.
 * It imports the necessary modules, configures the environment variables,
 * and establishes a connection to the database.
 */

import app from './app.js';
import connectDB from './db/index.js';
import dotenv from 'dotenv';
import swagger from './utils/swagger.js';

dotenv.config({
  path: '.env',
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    swagger(app, process.env.PORT); //Generate swagger documentation
  });
});
