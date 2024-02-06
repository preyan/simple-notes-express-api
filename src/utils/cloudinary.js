import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

/**
 * Uploads a file to Cloudinary.
 * @param {string} localFilePath - The path of the local file to upload.
 * @returns {Promise<Object>} - The upload response from Cloudinary.
 * @throws {Error} - If there is no file to upload.
 */
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Checks if there is a file to upload
    if (!localFilePath) {
      throw new Error('No file to upload');
    }

    // Uploads the file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // Deletes the file from the local storage
    fs.unlinkSync(localFilePath); // Deletes the file from the local storage after uploading it to Cloudinary

    return uploadResponse;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Deletes the file from the local storage when an error occurs
    console.error(error);
    return error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    // Deletes the file from Cloudinary
    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    return deleteResponse;
  } catch (error) {
    console.error(error);
    return error;
  }
};
