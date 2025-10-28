import Freelancer from "../models/Freelancer.js";
import ProjectPost from "../models/ProjectPost.js";

// ====================================================
// 🔍 Search Freelancers (for Clients)
// ====================================================
export const searchFreelancers = async (req, res) => {
  try {
    const { skills, location, minPrice, maxPrice } = req.query;

    // Create dynamic query
    const query = {};

    if (skills) {
      query.skills = { $in: skills.split(",").map((s) => s.trim()) };
    }

    if (location) {
      query["location.city"] = { $regex: location, $options: "i" };
    }

    // Optional: price-based search (if you store rates in Freelancer model)
    if (minPrice || maxPrice) {
      query["hourlyRate"] = {};
      if (minPrice) query["hourlyRate"].$gte = Number(minPrice);
      if (maxPrice) query["hourlyRate"].$lte = Number(maxPrice);
    }

    const freelancers = await Freelancer.find(query)
      .populate("user", "name email")
      .select("-__v");

    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================================================
// 🔍 Search Projects (for Freelancers)
// ====================================================
export const searchProjects = async (req, res) => {
  try {
    const { skills, minBudget, maxBudget, status } = req.query;

    const query = {};

    if (skills) {
      query.skillsRequired = { $in: skills.split(",").map((s) => s.trim()) };
    }

    if (status) {
      query.status = status;
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const projects = await ProjectPost.find(query)
      .populate("client", "companyName")
      .select("-__v");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
