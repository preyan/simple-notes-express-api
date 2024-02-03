import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Represents a user in the system.
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} fullName - The full name of the user.
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
    fullName: {
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
 * Encrypts the user's password before saving it to the database.
 * @param {import('mongoose').HookNextFunction} next - The next function to call in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain is complete.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Verifies that the provided password matches the user's password.
 * @param {string} password - The password to verify.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password matches, or false if it does not.
 */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Generates a JWT access token for the user.
 * @returns {string} - The generated JWT token.
 */
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generates a JWT refresh token for the user.
 * @returns {string} - The generated JWT token.
 */
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Mongoose model for the User schema.
 * @type {import('mongoose').Model<User>}
 */
export const User = mongoose.model('User', userSchema);
