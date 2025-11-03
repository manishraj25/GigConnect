import express from "express";
import {
  upsertFreelancerProfile,
  addPortfolioItem,
  getMyProfile,
  updateUserInfo,
  deleteFreelancerProfile,
  getFreelancerById,
  updateBankDetails,
  getBankDetails
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
  upload.array("portfolioImages", 5),
  addPortfolioItem
);

//Delete Freelancer Profile
freelancerRouter.delete("/delete", authMiddleware, deleteFreelancerProfile);

//Get Freelancer Profile by ID (public)
freelancerRouter.get("/:id", getFreelancerById);


//Bank details routes
freelancerRouter.put("/bank-details", authMiddleware, updateBankDetails);
freelancerRouter.get("/bank-details", authMiddleware, getBankDetails);

export default freelancerRouter;
