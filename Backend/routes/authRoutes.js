import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/authController.js';

const authRouter = express.Router();

//auth routes
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);

export default authRouter;
