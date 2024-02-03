import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTToken } from '../middlewares/auth.middleware.js';

/**
 * Express router instance for handling user routes.
 * @type {Router}
 */
const router = Router();

router
  .route('/register')
  .post(upload.single('avatar'), userController.registerUser);
router.route('/login').post(userController.loginUser);

//Secured routes
router.route('/logout').post(verifyJWTToken, userController.logoutUser);
-(
  //verifyJWTToken is a middleware which checks if the user is authenticated
  router.route('/refresh-token').post(userController.refreshAccessToken)
);

// You can add multiple middlewares like below.
// router.route('logout').post(verifyJWTToken, AnotherMiddleware, logoutUser);
// AnotherMiddleware is a placeholder for another middleware

export default router;
