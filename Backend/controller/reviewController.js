import Review from "../models/Review.js";
import Gigs from "../models/Gigs.js";
import Freelancer from "../models/Freelancer.js";
import Client from "../models/Client.js";

//Create a new review
export const createReview = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { rating, comment } = req.body;
    const reviewer = req.user._id;

    // Check if gig exists
    const gig = await Gigs.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // Prevent duplicate reviews from same user
    const existingReview = await Review.findOne({ gig: gigId, reviewer });
    if (existingReview)
      return res.status(400).json({ message: "You already reviewed this gig" });

    // Create review
    const review = await Review.create({
      gig: gigId,
      reviewer,
      rating,
      comment,
    });

    // Update average rating for the gig
    const allReviews = await Review.find({ gig: gigId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    gig.averageRating = avgRating.toFixed(1);
    await gig.save();

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Get all reviews for a gig (with reviewer profile image)
export const getReviewsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    // Get all reviews for this gig
    const reviews = await Review.find({ gig: gigId })
      .populate("reviewer", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    // Attach profile images dynamically based on reviewer role
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        let profileImage = { url: "", public_id: "" };

        if (review.reviewer?.role === "freelancer") {
          const freelancer = await Freelancer.findOne({
            user: review.reviewer._id,
          }).select("profileImage");
          if (freelancer) profileImage = freelancer.profileImage;
        } else if (review.reviewer?.role === "client") {
          const client = await Client.findOne({
            user: review.reviewer._id,
          }).select("profileImage");
          if (client) profileImage = client.profileImage;
        }

        return {
          ...review,
          reviewer: {
            ...review.reviewer,
            profileImage,
          },
        };
      })
    );

    res.status(200).json({
      totalResults: enrichedReviews.length,
      reviews: enrichedReviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Update a review (only by reviewer)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.reviewer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    // Update average rating for the gig
    const allReviews = await Review.find({ gig: review.gig });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Gigs.findByIdAndUpdate(review.gig, {
      averageRating: avgRating.toFixed(1),
    });

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Delete review (only by reviewer)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.reviewer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const gigId = review.gig;
    await review.deleteOne();

    // Recalculate average rating after deletion
    const remainingReviews = await Review.find({ gig: gigId });
    const avgRating =
      remainingReviews.length > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
          remainingReviews.length
        : 0;

    await Gigs.findByIdAndUpdate(gigId, { averageRating: avgRating.toFixed(1) });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
