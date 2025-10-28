import express from "express";
import {
  createReview,
  getReviewsForGig,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all reviews for a gig
router.get("/:gigId", getReviewsForGig);

// Add a new review (client)
router.post("/:gigId", protect, createReview);

// Update or delete review (only reviewer)
router.put("/:reviewId", protect, updateReview);
router.delete("/:reviewId", protect, deleteReview);

export default router;
