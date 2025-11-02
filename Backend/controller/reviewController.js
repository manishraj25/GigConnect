import Review from "../models/Review.js";
import Freelancer from "../models/Freelancer.js";
import Gigs from "../models/Gigs.js";
import User from "../models/User.js";

// Helper: recalculate freelancer average rating
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

// Add review (works for both gig or profile)
export const addReview = async (req, res) => {
  try {
    const { freelancerId, gigId, rating, comment } = req.body;
    const reviewerId = req.user._id; // from authMiddleware

    // Validate freelancer
    const freelancer = await Freelancer.findById(freelancerId);
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });

    // Optional: check gig only if provided
    if (gigId) {
      const gig = await Gigs.findById(gigId);
      if (!gig) return res.status(404).json({ message: "Gig not found" });
    }

    // Create review (gigId optional)
    const review = await Review.create({
      freelancer: freelancerId,
      reviewer: reviewerId,
      gig: gigId || null,
      rating,
      comment,
    });

    // Update freelancer rating
    await updateFreelancerRating(freelancerId);

    // Populate reviewer details (name + profileImage)
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

//  Get all reviews of a freelancer
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

// Delete review (only client who made it)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    const freelancerId = review.freelancer;

    await review.deleteOne();

    // Recalculate ratings
    await updateFreelancerRating(freelancerId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
