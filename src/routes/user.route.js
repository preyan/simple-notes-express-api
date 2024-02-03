import { Router } from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTToken } from '../middlewares/auth.middleware.js';

/**
 * Express router instance for handling user routes.
 * @type {Router}
 */
const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);

//Secured routes
router.route('/logout').post(verifyJWTToken, logoutUser);

// You can add multiple middlewares like this.
// router.route('logout').post(verifyJWTToken, AnotherMiddleware, logoutUser);
// AnotherMiddleware is a placeholder for another middleware

export default router;
