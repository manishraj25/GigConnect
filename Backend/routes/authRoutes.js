import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();

//auth routes
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);

authRouter.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have accessed a protected route', user: req.user });
});

export default authRouter;
