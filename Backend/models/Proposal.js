import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectPost", required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
  coverLetter: { type: String, required: true },
  proposedBudget: { type: Number, required: true },
  proposedDeadline: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Proposal = mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);
export default Proposal;
