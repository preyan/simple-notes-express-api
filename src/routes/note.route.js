import { Router } from 'express';
import { noteController } from '../controllers/note.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTToken } from '../middlewares/auth.middleware.js';

/**
 * Express router instance for handling note routes.
 * @type {Router}
 */
const router = Router();

//Secured routes goes here

/**
 * Route for getting all notes.
 * Requires JWT token verification.
 */
router.route('/').get(verifyJWTToken, noteController.getAllNotes);

/**
 * Route for creating a new note.
 * Requires JWT token verification and file upload using multer middleware.
 */
router
  .route('/create')
  .post(verifyJWTToken, upload.array('images'), noteController.createNote);

/**
 * Route for deleting a note by ID.
 * Requires JWT token verification.
 * @param {string} id - The ID of the note to be deleted.
 */
router.route('/delete/:id').delete(verifyJWTToken, noteController.deleteNote);

/**
 * Route for updating a note by ID.
 * Requires JWT token verification.
 * @param {string} id - The ID of the note to be updated.
 */
router.route('/update/:id').put(verifyJWTToken, noteController.updateNote);

// You can add multiple middlewares like below.
// router.route('logout').post(verifyJWTToken, AnotherMiddleware, logoutUser);
// AnotherMiddleware is a placeholder for another middleware

export default router;
