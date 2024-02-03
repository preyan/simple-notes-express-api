import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTToken } from '../middlewares/auth.middleware.js';

/**
 * Express router instance for handling user routes.
 * @type {Router}
 */
const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('login').post(loginUser);

//Secured routes
router.route('logout').post(verifyJWTToken, logoutUser);

export default router;
