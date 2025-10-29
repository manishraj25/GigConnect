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

const clientRouter = express.Router();

// ✅ Multer setup for image uploads (Cloudinary)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ------------------------------------
// 🔒 Private Routes (Client logged in)
// ------------------------------------

// Create or update client profile
clientRouter.post("/profile", protect, upload.single("profileImage"), upsertClientProfile);

// Get my profile (client dashboard)
clientRouter.get("/me", protect, getMyProfile);

// Update basic user info (name, email, password)
clientRouter.put("/update-user", protect, updateUserInfo);

// Delete client profile
clientRouter.delete("/delete", protect, deleteClientProfile);

// ------------------------------------
// 🌍 Public Route (Freelancers can view)
// ------------------------------------

// Get a specific client profile (public view)
clientRouter.get("/:id", getClientById);

export default clientRouter;
