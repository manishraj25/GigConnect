import Review from "../models/Review.js";
import Gigs from "../models/Gigs.js";

// ✅ Create new review
export const createReview = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { rating, comment } = req.body;
    const reviewer = req.user._id;

    // check if gig exists
    const gig = await Gigs.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // prevent duplicate reviews
    const existingReview = await Review.findOne({ gig: gigId, reviewer });
    if (existingReview)
      return res.status(400).json({ message: "You already reviewed this gig" });

    const review = await Review.create({
      gig: gigId,
      reviewer,
      rating,
      comment
    });

    // optional: update average rating in Gig model
    const allReviews = await Review.find({ gig: gigId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    gig.averageRating = avgRating.toFixed(1);
    await gig.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all reviews for a gig
export const getReviewsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const reviews = await Review.find({ gig: gigId })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a review (only by reviewer)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.reviewer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json({ message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete review (only by reviewer)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.reviewer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await review.deleteOne();

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
