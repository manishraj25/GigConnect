import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created"
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
