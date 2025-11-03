import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import Freelancer from "../models/Freelancer.js";

dotenv.config();


// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const RAZORPAYX_BASE_URL = "https://api.razorpay.com/v1/payouts";


// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, freelancerId } = req.body;

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      orderId: order.id,
      clientId: req.user.id,
      freelancerId,
      amount,
      status: "created",
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};


// Verify Payment + Trigger RazorpayX Payout
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid Razorpay signature" });
    }

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, status: "paid" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    const freelancer = await Freelancer.findById(payment.freelancerId).populate("user", "name email phone");
    if (!freelancer || !freelancer.bankDetails) {
      return res.status(404).json({ message: "Freelancer bank details not found" });
    }

    // Commission calculation
    const platformFeePercent = Number(process.env.PLATFORM_COMMISSION_PERCENT || 10);
    const platformFee = (platformFeePercent / 100) * payment.amount;
    const freelancerAmount = payment.amount - platformFee;

    // Create payout via RazorpayX
    const payoutResponse = await axios.post(
      RAZORPAYX_BASE_URL,
      {
        account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER,
        fund_account: {
          account_type: "bank_account",
          bank_account: {
            name: freelancer.bankDetails.accountHolderName,
            account_number: freelancer.bankDetails.accountNumber,
            ifsc: freelancer.bankDetails.ifsc,
          },
          contact: {
            name: freelancer.user.name,
            email: freelancer.user.email,
            contact: freelancer.user.phone || "",
            type: "freelancer",
          },
        },
        amount: freelancerAmount * 100,
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        narration: "Freelancer Payment",
      },
      {
        auth: {
          username: process.env.RAZORPAYX_KEY_ID,
          password: process.env.RAZORPAYX_KEY_SECRET,
        },
      }
    );

    payment.platformFee = platformFee;
    payment.freelancerAmount = freelancerAmount;
    payment.payoutId = payoutResponse.data.id;
    payment.payoutStatus =
      payoutResponse.data.status === "processed" ? "success" : "pending";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment verified & payout initiated successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment verification/payout error:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment verification or payout failed" });
  }
};


// Transaction History for Client
export const getClientTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find({ clientId: req.user.id })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching client transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


// Transaction History for Freelancer
export const getFreelancerTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find({ freelancerId: req.user.id })
      .populate("clientId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching freelancer transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
