import ProjectPost from "../models/ProjectPost.js";

//Create project
export const createProject = async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, deadline } = req.body;
    const client = req.user._id;

    if (!title || !description || !budget || !deadline)
      return res.status(400).json({ message: "Missing required fields" });

    const project = await ProjectPost.create({
      client, title, description, skillsRequired, budget, deadline
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectPost.find()
      .populate({
        path: "client",
        populate: {
          path: "user",
          select: "name email"
        },
        select: "companyName location"
      })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      totalResults: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await ProjectPost.findById(req.params.id)
      .populate({
        path: "client",
        populate: {
          path: "user",
          select: "name email"
        },
        select: "companyName location"
      })
      .select("-__v");

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update project(client only)
export const updateProject = async (req, res) => {
  try {
    const project = await ProjectPost.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.client.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const updated = await ProjectPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Project updated", project: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete project (client only)
export const deleteProject = async (req, res) => {
  try {
    const project = await ProjectPost.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.client.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
