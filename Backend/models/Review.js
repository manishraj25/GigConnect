import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gigs" }, 
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the client who reviewed
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
