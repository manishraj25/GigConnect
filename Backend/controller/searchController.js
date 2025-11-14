import Freelancer from "../models/Freelancer.js";
import Gigs from "../models/Gigs.js";
import ProjectPost from "../models/ProjectPost.js";

//Search Freelancers & Return Their Gigs (for Clients)
export const searchFreelancers = async (req, res) => {
  try {
    const { searchTag, location, minPrice, maxPrice } = req.query;

    const freelancerQuery = {};

    if (searchTag) {
      // Search in searchTags or skills
      freelancerQuery.$or = [
        { searchTags: { $regex: searchTag, $options: "i" } },
        { skills: { $regex: searchTag, $options: "i" } },
        { headline: { $regex: searchTag, $options: "i" } },
      ];
    }

    const freelancers = await Freelancer.find(freelancerQuery)
      .populate("user", "name email")
      .select("_id searchTags skills location user headline");

    if (!freelancers.length) {
      return res.status(404).json({ message: "No freelancers found for this search tag." });
    }

    const freelancerIds = freelancers.map((f) => f._id);

    const gigQuery = { freelancer: { $in: freelancerIds } };

    // Filter gigs by price range
    if (minPrice || maxPrice) {
      gigQuery["price.minPrice"] = {};
      gigQuery["price.maxPrice"] = {};

      if (minPrice) gigQuery["price.minPrice"].$gte = Number(minPrice);
      if (maxPrice) gigQuery["price.maxPrice"].$lte = Number(maxPrice);
    }

    let gigs = await Gigs.find(gigQuery)
      .populate({
        path: "freelancer",
        populate: { path: "user", select: "name email" },
      })
      .select("-__v -updatedAt");

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

    //  Return results
    res.status(200).json({
      success: true,
      totalResults: gigs.length,
      filters: {
        searchTag: searchTag || "Any",
        location: location || "Any",
        minPrice: minPrice || "Any",
        maxPrice: maxPrice || "Any",
      },
      gigs,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Search projects (for Freelancers)
export const searchProjects = async (req, res) => {
  try {
    const { skills, minBudget, maxBudget, status, tags } = req.query;

    const query = {};

    // Filter by skills
    if (skills) {
      query.skillsRequired = { $in: skills.split(",").map((s) => s.trim()) };
    }

    // Filter by project status
    if (status) {
      query.status = status;
    }

    // Filter by budget range
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    // Filter by searchTags (NEW FEATURE)
    if (tags) {
      query.searchTags = { $in: tags.split(",").map((t) => t.trim()) };
    }

    const projects = await ProjectPost.find(query)
      .populate("client", "companyName")
      .select("-__v");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

