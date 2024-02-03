import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

/**
 * Express router instance for handling user routes.
 * @type {Router}
 */
const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);

export default router;
