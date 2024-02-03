import mongoose, { Schema } from 'mongoose';

/**
 * Represents a user in the system.
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} fullname - The full name of the user.
 * @property {string} avatar - The URL to the user's avatar image provided by Cloudinary.
 * @property {Schema.Types.ObjectId[]} notes - An array of note IDs associated with the user.
 * @property {string} password - The password of the user.
 * @property {string} refreshToken - The refresh token provided by Cloudinary for authentication.
 */

/**
 * Mongoose schema for the User model.
 * @type {Schema<User>}
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // This is a URL to the user's avatar image provided by Cloudinary.
      required: true,
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String, // JWT token - The refresh token is not required because it is only used for authentication.
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for the User schema.
 * @type {import('mongoose').Model<User>}
 */
export const User = mongoose.model('User', userSchema);
