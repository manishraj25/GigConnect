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

const router = express.Router();

router.get("/", getAllGigs);
router.get("/:id", getGigById);

router.post("/", protect, upload.array("images", 5), createGig);
router.put("/:id", protect, upload.array("images", 5), updateGig);
router.delete("/:id", protect, deleteGig);

export default router;
