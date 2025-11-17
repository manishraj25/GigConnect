import express from "express";
import {
  addReview,
  getFreelancerReviews,
  deleteReview,
} from "../controller/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// POST → client can review freelancer
reviewRouter.post("/", authMiddleware, addReview);

// GET → show all reviews for a freelancer
reviewRouter.get("/freelancer/:freelancerId", getFreelancerReviews);

// DELETE → remove a review (client only)
reviewRouter.delete("/:id", authMiddleware, deleteReview);

export default reviewRouter;
