import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer" },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gigs" },
  amount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  freelancerAmount: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
  payoutStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  payoutId: { type: String }, 
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
