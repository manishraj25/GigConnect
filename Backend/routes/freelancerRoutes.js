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

const router = express.Router();

// ---------------------------------------
// 🧑‍💼 Freelancer Profile Management
// ---------------------------------------

// ✅ Create or Update Freelancer Profile
router.post(
  "/profile",
  authMiddleware,
  upload.single("profileImage"), // single profile image
  upsertFreelancerProfile
);

// ✅ Get Logged-in Freelancer Profile
router.get("/me", authMiddleware, getMyProfile);

// ✅ Update User Info (Name, Email, Password)
router.put("/update-user", authMiddleware, updateUserInfo);

// ✅ Add Portfolio Item (Multiple Images)
router.post(
  "/portfolio",
  authMiddleware,
  upload.array("portfolioImages", 5), // up to 5 images per portfolio item
  addPortfolioItem
);

// ✅ Delete Freelancer Profile
router.delete("/delete", authMiddleware, deleteFreelancerProfile);

// ---------------------------------------
// 🌍 Public Route (for Clients)
// ---------------------------------------

// ✅ Get Freelancer Profile by ID (public)
router.get("/:id", getFreelancerById);

export default router;
