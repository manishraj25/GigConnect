import express from "express";
import {
  upsertFreelancerProfile,
  addPortfolioItem,
  getMyProfile,
  updateUserInfo,
  deleteFreelancerProfile,
  getFreelancerById,
} from "../controllers/freelancerController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js"; // ✅ your Cloudinary multer middleware

const freelancerRouter = express.Router();

// ---------------------------------------
// 🧑‍💼 Freelancer Profile Management
// ---------------------------------------

// ✅ Create or Update Freelancer Profile
freelancerRouter.post(
  "/profile",
  authMiddleware,
  upload.single("profileImage"), // single profile image
  upsertFreelancerProfile
);

// ✅ Get Logged-in Freelancer Profile
freelancerRouter.get("/me", authMiddleware, getMyProfile);

// ✅ Update User Info (Name, Email, Password)
freelancerRouter.put("/update-user", authMiddleware, updateUserInfo);

// ✅ Add Portfolio Item (Multiple Images)
freelancerRouter.post(
  "/portfolio",
  authMiddleware,
  upload.array("portfolioImages", 5), // up to 5 images per portfolio item
  addPortfolioItem
);

// ✅ Delete Freelancer Profile
freelancerRouter.delete("/delete", authMiddleware, deleteFreelancerProfile);

// ---------------------------------------
// 🌍 Public Route (for Clients)
// ---------------------------------------

// ✅ Get Freelancer Profile by ID (public)
freelancerRouter.get("/:id", getFreelancerById);

export default freelancerRouter;
