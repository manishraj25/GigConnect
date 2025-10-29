import express from "express";
import { searchFreelancers, searchProjects } from "../controller/searchController.js";

const searchRouter = express.Router();

// Clients → Search Freelancers
searchRouter.get("/freelancers", searchFreelancers);

// Freelancers → Search Projects
searchRouter.get("/projects", searchProjects);

export default searchRouter;
