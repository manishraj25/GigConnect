import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getClientProjects
} from "../controller/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const projectRouter = express.Router();

projectRouter.get("/client", authMiddleware, getClientProjects);
projectRouter.post("/", authMiddleware, createProject);
projectRouter.put("/:id", authMiddleware, updateProject);
projectRouter.delete("/:id", authMiddleware, deleteProject);

projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);

export default projectRouter;
