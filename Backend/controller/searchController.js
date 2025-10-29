import Freelancer from "../models/Freelancer.js";
import ProjectPost from "../models/ProjectPost.js";

// ====================================================
// 🔍 CLIENT SEARCH — Find Freelancers by Domain, then Filter
// ====================================================

export const searchFreelancers = async (req, res) => {
  try {
    const { domain, location, minPrice, maxPrice } = req.query;

    // Step 1: Match freelancers by domain name
    const freelancerQuery = {};

    if (domain) {
      // domain match — any domain in array that includes the searched value
      freelancerQuery.domains = { $regex: domain, $options: "i" };
    }

    const freelancers = await Freelancer.find(freelancerQuery)
      .populate("user", "name email")
      .select("_id domains location user");

    if (!freelancers.length) {
      return res.status(404).json({ message: "No freelancers found for this domain." });
    }

    // Step 2: Collect freelancer IDs
    const freelancerIds = freelancers.map((f) => f._id);

    // Step 3: Find gigs for these freelancers
    const gigQuery = { freelancer: { $in: freelancerIds } };

    // Optional: Filter gigs by price range
    if (minPrice || maxPrice) {
      gigQuery["price.minprice"] = {};
      gigQuery["price.maxprice"] = {};

      if (minPrice) gigQuery["price.minprice"].$gte = Number(minPrice);
      if (maxPrice) gigQuery["price.maxprice"].$lte = Number(maxPrice);
    }

    let gigs = await Gigs.find(gigQuery)
      .populate({
        path: "freelancer",
        populate: { path: "user", select: "name email" },
      })
      .select("-__v");

    // Step 4: Filter by location (if provided)
    if (location) {
      gigs = gigs.filter((gig) => {
        const loc = gig.freelancer.location || {};
        return (
          loc.city?.toLowerCase().includes(location.toLowerCase()) ||
          loc.country?.toLowerCase().includes(location.toLowerCase()) ||
          loc.state?.toLowerCase().includes(location.toLowerCase())
        );
      });
    }

    if (!gigs.length) {
      return res.status(404).json({ message: "No gigs found matching these filters." });
    }

    // Step 5: Return results
    res.json({
      totalResults: gigs.length,
      filters: {
        domain: domain || "Any",
        location: location || "Any",
        minPrice: minPrice || "Any",
        maxPrice: maxPrice || "Any",
      },
      gigs,
    });
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
