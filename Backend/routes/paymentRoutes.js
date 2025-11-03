import express from "express";
import {
  createOrder,
  verifyPayment,
  getClientTransactions,
  getFreelancerTransactions,
} from "../controller/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();


paymentRouter.post("/create-order", authMiddleware, createOrder);

paymentRouter.post("/verify", authMiddleware, verifyPayment);

paymentRouter.get("/client/history", authMiddleware, getClientTransactions);

paymentRouter.get("/freelancer/history", authMiddleware, getFreelancerTransactions);

export default paymentRouter;
