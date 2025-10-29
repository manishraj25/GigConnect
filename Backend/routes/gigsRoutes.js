import express from "express";
import {
  createGig,
  updateGig,
  deleteGig,
  getAllGigs,
  getGigById
} from "../controllers/gigController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const gigsRouter = express.Router();

gigsRouter.get("/", getAllGigs);
gigsRouter.get("/:id", getGigById);

gigsRouter.post("/", protect, upload.array("images", 5), createGig);
gigsRouter.put("/:id", protect, upload.array("images", 5), updateGig);
gigsRouter.delete("/:id", protect, deleteGig);

export default gigsRouter;
