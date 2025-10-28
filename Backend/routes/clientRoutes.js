import express from "express";
import multer from "multer";
import {
  upsertClientProfile,
  getMyProfile,
  updateUserInfo,
  deleteClientProfile,
  getClientById,
} from "../controllers/clientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Multer setup for image uploads (Cloudinary)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ------------------------------------
// 🔒 Private Routes (Client logged in)
// ------------------------------------

// Create or update client profile
router.post("/profile", protect, upload.single("profileImage"), upsertClientProfile);

// Get my profile (client dashboard)
router.get("/me", protect, getMyProfile);

// Update basic user info (name, email, password)
router.put("/update-user", protect, updateUserInfo);

// Delete client profile
router.delete("/delete", protect, deleteClientProfile);

// ------------------------------------
// 🌍 Public Route (Freelancers can view)
// ------------------------------------

// Get a specific client profile (public view)
router.get("/:id", getClientById);

export default router;
