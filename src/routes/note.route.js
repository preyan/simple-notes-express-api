import { Router } from 'express';
import { noteController } from '../controllers/note.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTToken } from '../middlewares/auth.middleware.js';

/**
 * Express router instance for handling note routes.
 * @type {Router}
 */
const router = Router();

/**
 * @openapi
 * /api/v1/notes/:
 *   get:
 *     summary: Get all notes
 *     description: Retrieve all notes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes retrieved successfully.
 */
router.route('/').get(verifyJWTToken, noteController.getNotes);

/**
 * @openapi
 * /api/v1/notes/create:
 *   post:
 *     summary: Create a new note
 *     description: Create a new note with file upload using multer middleware.
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: images
 *         type: file
 *         description: Images for the note.
 *     responses:
 *       200:
 *         description: Note created successfully.
 */
router
  .route('/create')
  .post(verifyJWTToken, upload.array('images'), noteController.createNote);

/**
 * @openapi
 * /api/v1/notes/delete/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     description: Delete a note by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the note to be deleted.
 *     responses:
 *       200:
 *         description: Note deleted successfully.
 */
router.route('/delete/:id').delete(verifyJWTToken, noteController.deleteNote);

/**
 * @openapi
 * /api/v1/notes/update/{id}:
 *   put:
 *     summary: Update a note by ID
 *     description: Update a note by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the note to be updated.
 *     responses:
 *       200:
 *         description: Note updated successfully.
 */
router.route('/update/:id').put(verifyJWTToken, noteController.updateNote);

export default router;
