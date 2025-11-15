import express from "express";
import {
    createGig,
    getMyGigs,
    getAllGigs,
    getGigById,
    updateGig,
    deleteGig
} from "../controller/gigsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const gigsRouter = express.Router();


gigsRouter.get("/mygigs", authMiddleware, getMyGigs);
gigsRouter.post("/", authMiddleware, upload.array("images", 5), createGig);
gigsRouter.put("/:id", authMiddleware, upload.array("images", 5), updateGig);
gigsRouter.delete("/:id", authMiddleware, deleteGig);

gigsRouter.get("/", getAllGigs);
gigsRouter.get("/:id", getGigById);

export default gigsRouter;
