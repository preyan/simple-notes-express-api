/* eslint-disable no-console */
/* eslint-disable no-undef */

import { DB_NAME } from './../constants.js';
import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database.
 * @async
 * @function connectDB - A function that connects to the MongoDB database using the provided MONGODB_URI and DB_NAME.
 * @returns {Promise<void>} - A Promise that resolves when the connection is successful or rejects with an error.
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connection SUCCESS - DB Host : ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(`MongoDB connection FAILED - Error : ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
