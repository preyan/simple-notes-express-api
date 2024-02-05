import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { userController } from '../controllers/user.controller.js';
import { verifyJWTToken } from '../middlewares/auth.middleware.js';

/**
 * Express router instance for handling user routes.
 * @type {Router}
 */
const router = Router();

/**
 * @openapi
 * users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with an avatar upload.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: avatar
 *         type: file
 *         description: User's avatar image file.
 *     responses:
 *       200:
 *         description: User registered successfully.
 */
router
  .route('/register')
  .post(upload.single('avatar'), userController.registerUser);

/**
 * @openapi
 * users/login:
 *   post:
 *     summary: User login
 *     description: Login with user credentials.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 */
router.route('/login').post(userController.loginUser);

/**
 * @openapi
 * users/healthcheck:
 *   get:
 *     summary: Health check
 *     description: Check the health of the user controller.
 *     responses:
 *       200:
 *         description: Health check successful.
 */
router.route('/healthcheck').get(userController.healthCheck);

/**
 * @openapi
 * users/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logout the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 */
router.route('/logout').post(verifyJWTToken, userController.logoutUser);

/**
 * @openapi
 * users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Refresh the access token for an authenticated user.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 */
router.route('/refresh-token').post(userController.refreshAccessToken);

// Example with multiple middlewares
// router.route('/logout').post(verifyJWTToken, AnotherMiddleware, userController.logoutUser);

export default router;
