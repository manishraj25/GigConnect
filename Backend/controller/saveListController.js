import SaveList from "../models/SaveList.js";
import Gigs from "../models/Gigs.js";
import ProjectPost from "../models/ProjectPost.js";


//save gig
export const saveGig = async (req, res) => {
  try {
    const clientId = req.user.id;
    const gigId = req.params.id;

    const exists = await SaveList.findOne({ user: clientId, gig: gigId });
    if (exists) return res.status(400).json({ message: "Gig already saved" });

    const savedGig = await SaveList.create({
      user: clientId,
      gig: gigId,
      project: null
    });

    res.status(201).json({ message: "Gig saved successfully", savedGig });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//remove saved gigs
export const removeSavedGig = async (req, res) => {
  try {
    const clientId = req.user.id;
    const gigId = req.params.id;

    const deleted = await SaveList.findOneAndDelete({
      user: clientId,
      gig: gigId
    });

    if (!deleted)
      return res.status(404).json({ message: "Saved gig not found" });

    res.status(200).json({ message: "Gig removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//get all projects
export const getSavedGigs = async (req, res) => {
  try {
    const clientId = req.user.id;

    const savedGigs = await SaveList.find({
      user: clientId,
      gig: { $ne: null }
    })
      .populate({
        path: "gig",
        populate: {
          path: "freelancer",
          select: "profileImage headline location",
          populate: {
            path: "user",
            select: "name email"
          }
        }
      })
      .sort({ savedAt: -1 });

    res.status(200).json({ savedGigs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//save projects
export const saveProject = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const projectId = req.params.id;

    const exists = await SaveList.findOne({
      user: freelancerId,
      project: projectId
    });

    if (exists)
      return res.status(400).json({ message: "Project already saved" });

    const savedProject = await SaveList.create({
      user: freelancerId,
      project: projectId,
      gig: null
    });

    res.status(201).json({ message: "Project saved successfully", savedProject });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//remove saved projects
export const removeSavedProject = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const projectId = req.params.id;

    const deleted = await SaveList.findOneAndDelete({
      user: freelancerId,
      project: projectId
    });

    if (!deleted)
      return res.status(404).json({ message: "Saved project not found" });

    res.status(200).json({ message: "Project removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//get all projects
export const getSavedProjects = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const savedProjects = await SaveList.find({
      user: freelancerId,
      project: { $ne: null }
    })
      .populate({
        path: "project",
        populate: [
          {
            path: "client",
            select: "companyName location profileImage", 
            populate: {
              path: "user",
              select: "name email"
            }
          }
        ]
      })
      .sort({ savedAt: -1 });

    res.status(200).json({ savedProjects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
