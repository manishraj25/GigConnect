import express from "express";
import {
  createReview,
  getReviewsForGig,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// Get all reviews for a gig
reviewRouter.get("/:gigId", getReviewsForGig);

// Add a new review (client)
reviewRouter.post("/:gigId", protect, createReview);

// Update or delete review (only reviewer)
reviewRouter.put("/:reviewId", protect, updateReview);
reviewRouter.delete("/:reviewId", protect, deleteReview);

export default reviewRouter;
