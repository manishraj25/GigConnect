import express from "express";
import { saveGig, removeSavedGig, getSavedGigs } from "../controller/saveListController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const saveListRouter = express.Router();

// Save a gig
saveListRouter.post("/save/:id", authMiddleware, saveGig);

// Remove saved gig
saveListRouter.delete("/save/:id", authMiddleware, removeSavedGig);

// Get all saved gigs for client
saveListRouter.get("/saved", authMiddleware, getSavedGigs);

export default saveListRouter;
