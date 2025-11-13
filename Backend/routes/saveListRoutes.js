import express from "express";
import {
  saveGig,
  removeSavedGig,
  getSavedGigs,
  saveProject,
  removeSavedProject,
  getSavedProjects
} from "../controller/saveListController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const saveListRouter = express.Router();


// Save a gig
saveListRouter.post("/gig/:id", authMiddleware, saveGig);

// Remove saved gig
saveListRouter.delete("/gig/:id", authMiddleware, removeSavedGig);

// Get all saved gigs for client
saveListRouter.get("/saved/gigs", authMiddleware, getSavedGigs);


// Save a project
saveListRouter.post("/project/:id", authMiddleware, saveProject);

// Remove saved project
saveListRouter.delete("/project/:id", authMiddleware, removeSavedProject);

// Get all saved projects
saveListRouter.get("/saved/projects", authMiddleware, getSavedProjects);

export default saveListRouter;
