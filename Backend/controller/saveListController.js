import SaveList from "../models/SaveList.js";
import Gigs from "../models/Gigs.js";

// Save a gig
export const saveGig = async (req, res) => {
  try {
    const clientId = req.user.id;
    const gigId = req.params.id;

    // check if already saved
    const exists = await SaveList.findOne({ client: clientId, gig: gigId });
    if (exists) return res.status(400).json({ message: "Gig already saved" });

    const savedGig = await SaveList.create({ client: clientId, gig: gigId });
    res.status(201).json({ message: "Gig saved successfully", savedGig });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove saved gig
export const removeSavedGig = async (req, res) => {
  try {
    const clientId = req.user.id;
    const gigId = req.params.id;

    const deleted = await SaveList.findOneAndDelete({ client: clientId, gig: gigId });
    if (!deleted) return res.status(404).json({ message: "Saved gig not found" });

    res.status(200).json({ message: "Gig removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all saved gigs for client
export const getSavedGigs = async (req, res) => {
  try {
    const clientId = req.user.id;

    const savedGigs = await SaveList.find({ client: clientId })
      .populate({
        path: "gig",
        populate: {
          path: "freelancer",
          populate: { path: "user", select: "name profileImage" } // populate freelancer user info
        }
      })
      .sort({ savedAt: -1 });

    res.status(200).json({ savedGigs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
