import express from "express";
import upload from "../middleware/upload.js";
import {
  upsertClientProfile,
  getMyProfile,
  updateUserInfo,
  deleteClientProfile,
  getClientById,
} from "../controller/clientController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const clientRouter = express.Router();




// Create or update client profile
clientRouter.post("/profile", authMiddleware, upload.single("profileImage"), upsertClientProfile);

// Get my profile (client dashboard)
clientRouter.get("/me", authMiddleware, getMyProfile);

// Update basic user info (name, email, password)
clientRouter.put("/update-user", authMiddleware, updateUserInfo);

// Delete client profile
clientRouter.delete("/delete", authMiddleware, deleteClientProfile);



// Get a specific client profile (public view)
clientRouter.get("/:id", getClientById);

export default clientRouter;
