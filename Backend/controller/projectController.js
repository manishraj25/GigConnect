import ProjectPost from "../models/ProjectPost.js";
import Client from "../models/Client.js";


//Create a new Project (Client)
export const createProject = async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, deadline } = req.body;

    // Find client linked to logged-in user
    const clientData = await Client.findOne({ user: req.user.id });
    if (!clientData)
      return res.status(404).json({ message: "Client profile not found" });

    // Basic validations
    if (!title || !description || !budget || !deadline)
      return res.status(400).json({ message: "Missing required fields" });

    if (new Date(deadline) < new Date())
      return res
        .status(400)
        .json({ message: "Deadline must be a future date" });

    // Create project
    const project = await ProjectPost.create({
      client: clientData.id,
      title,
      description,
      skillsRequired,
      budget,
      deadline,
    });

    // Populate client & user info for response
    const populatedProject = await project.populate({
      path: "client",
      populate: { path: "user", select: "name email" },
      select: "companyName location",
    });

    res.status(201).json({
      message: "✅ Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get all Projects (Public)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectPost.find()
      .populate({
        path: "client",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "companyName location",
      })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      totalResults: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get a Single Project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await ProjectPost.findById(req.params.id)
      .populate({
        path: "client",
        populate: {
          path: "user",
          select: "name email",
        },
        select: "companyName location",
      })
      .select("-__v");

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get all Projects by Logged-in Client
export const getClientProjects = async (req, res) => {
  try {
    const clientData = await Client.findOne({ user: req.user.id });
    if (!clientData)
      return res.status(404).json({ message: "Client profile not found" });

    const projects = await ProjectPost.find({ client: clientData.id })
      .populate({
        path: "client",
        populate: { path: "user", select: "name email" },
        select: "companyName location",
      })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      totalResults: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Error fetching client projects:", error);
    res.status(500).json({ message: error.message });
  }
};


// Update a Project (Client Only)
export const updateProject = async (req, res) => {
  try {
    const project = await ProjectPost.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const clientData = await Client.findOne({ user: req.user.id });
    if (!clientData)
      return res.status(404).json({ message: "Client profile not found" });

    if (project.client.toString() !== clientData.id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    const updatedProject = await ProjectPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      message: "✅ Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: error.message });
  }
};


// Delete a Project (Client Only)
export const deleteProject = async (req, res) => {
  try {
    const project = await ProjectPost.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const clientData = await Client.findOne({ user: req.user.id });
    if (!clientData)
      return res.status(404).json({ message: "Client profile not found" });

    if (project.client.toString() !== clientData.id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await project.deleteOne();
    res.json({ message: "✅ Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: error.message });
  }
};
