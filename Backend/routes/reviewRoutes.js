import express from "express";
import {
  createReview,
  getReviewsForGig,
  updateReview,
  deleteReview
} from "../controller/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// Get all reviews for a gig
reviewRouter.get("/:gigId", getReviewsForGig);

// Add a new review (client)
reviewRouter.post("/:gigId", authMiddleware, createReview);

// Update or delete review (only reviewer)
reviewRouter.put("/:reviewId", authMiddleware, updateReview);
reviewRouter.delete("/:reviewId", authMiddleware, deleteReview);

export default reviewRouter;
