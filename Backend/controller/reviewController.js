import Review from "../models/Review.js";
import Freelancer from "../models/Freelancer.js";
import User from "../models/User.js";

// Recalculate freelancer rating
const updateFreelancerRating = async (freelancerId) => {
  const reviews = await Review.find({ freelancer: freelancerId });

  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    await Freelancer.findByIdAndUpdate(freelancerId, {
      averageRating: 0,
      totalReviews: 0,
    });
    return;
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = (totalRating / totalReviews).toFixed(1);

  await Freelancer.findByIdAndUpdate(freelancerId, {
    averageRating,
    totalReviews,
  });
};

// Add Review
export const addReview = async (req, res) => {
  try {
    const { freelancerId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    // Validate freelancer
    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });

    // Create review
    const review = await Review.create({
      freelancer: freelancerId,
      reviewer: reviewerId,
      rating,
      comment,
    });

    // Update rating stats
    await updateFreelancerRating(freelancerId);

    // Populate reviewer info
    const populatedReview = await review.populate({
      path: "reviewer",
      select: "name profileImage",
    });

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Reviews for a Freelancer
export const getFreelancerReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const reviews = await Review.find({ freelancer: freelancerId })
      .populate({
        path: "reviewer",
        select: "name profileImage",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalResults: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching freelancer reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review)
      return res.status(404).json({ message: "Review not found" });

    if (review.reviewer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const freelancerId = review.freelancer;

    await review.deleteOne();

    await updateFreelancerRating(freelancerId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
