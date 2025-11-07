import express from "express";
import {
  upsertFreelancerProfile,
  addPortfolioItem,
  getMyProfile,
  updateUserInfo,
  deleteFreelancerProfile,
  getFreelancerById,
  updateBankDetails,
  getBankDetails,
  deletePortfolioItem,
  updatePortfolioItem,
} from "../controller/freelancerController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const freelancerRouter = express.Router();

//FREELANCER PROFILE

// Create or Update Freelancer Profile
freelancerRouter.post(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  upsertFreelancerProfile
);

// Get Logged-in Freelancer Profile
freelancerRouter.get("/me", authMiddleware, getMyProfile);

// Update User Info (Name, Email, Password)
freelancerRouter.put("/update-user", authMiddleware, updateUserInfo);

// Delete Freelancer Profile
freelancerRouter.delete("/delete", authMiddleware, deleteFreelancerProfile);

// Get Freelancer Profile by ID (public)
freelancerRouter.get("/:id", getFreelancerById);

//PORTFOLIO

// Add Portfolio Item (Multiple Images)
freelancerRouter.post(
  "/portfolio",
  authMiddleware,
  upload.array("portfolioImages", 5),
  addPortfolioItem
);

// Edit / Update a Portfolio Item
freelancerRouter.put(
  "/portfolio/:id",
  authMiddleware,
  upload.array("portfolioImages", 5),
  updatePortfolioItem
);

// Delete a Portfolio Item
freelancerRouter.delete(
  "/portfolio/:id",
  authMiddleware,
  deletePortfolioItem
);

//BANK DETAILS
// Save or Update Bank Details
freelancerRouter.put("/bank-details", authMiddleware, updateBankDetails);

// Get Bank Details
freelancerRouter.get("/bank-details", authMiddleware, getBankDetails);

export default freelancerRouter;
