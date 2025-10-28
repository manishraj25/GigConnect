import express from "express";
import { searchFreelancers, searchProjects } from "../controllers/searchController.js";

const router = express.Router();

// Clients → Search Freelancers
router.get("/freelancers", searchFreelancers);

// Freelancers → Search Projects
router.get("/projects", searchProjects);

export default router;
