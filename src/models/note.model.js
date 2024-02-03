import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
/**
 * Represents a note in the system.
 * @typedef {Object} Note
 * @property {string} title - The title of the note.
 * @property {string} content - The content of the note.
 * @property {Schema.Types.ObjectId} author - The ID of the user who created the note.
 * @property {string[]} images - An array of Cloudinary URLs for images associated with the note.
 * @property {Date} isDeleted - A flag indicating whether the note has been deleted. Default is false.
 * @property {Date} deletedAt - The date and time when the note was deleted. Default is null.
 */

/**
 * Mongoose schema for the Note model.
 * @type {Schema<Note>}
 */
const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(mongooseAggregatePaginate); // Add pagination plugin to schema

/**
 * Mongoose model for the Note schema.
 * @type {import('mongoose').Model<Note>}
 */
export const Note = mongoose.model('Note', noteSchema);
