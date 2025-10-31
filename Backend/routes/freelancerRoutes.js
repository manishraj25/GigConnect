import express from "express";
import {
  upsertFreelancerProfile,
  addPortfolioItem,
  getMyProfile,
  updateUserInfo,
  deleteFreelancerProfile,
  getFreelancerById,
} from "../controller/freelancerController.js";

import authMiddleware  from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; 

const freelancerRouter = express.Router();



// Create or Update Freelancer Profile
freelancerRouter.post(
  "/profile",
  authMiddleware,
  upload.single("profileImage"), 
  upsertFreelancerProfile
);

// Get Logged-in Freelancer Profile
freelancerRouter.get("/me", authMiddleware, getMyProfile);

//Update User Info (Name, Email, Password)
freelancerRouter.put("/update-user", authMiddleware, updateUserInfo);

//Add Portfolio Item (Multiple Images)
freelancerRouter.post(
  "/portfolio",
  authMiddleware,
  upload.array("portfolioImages", 5), // up to 5 images per portfolio item
  addPortfolioItem
);

//Delete Freelancer Profile
freelancerRouter.delete("/delete", authMiddleware, deleteFreelancerProfile);



//Get Freelancer Profile by ID (public)
freelancerRouter.get("/:id", getFreelancerById);

export default freelancerRouter;
