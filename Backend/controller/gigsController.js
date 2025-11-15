import Gigs from "../models/Gigs.js";
import Freelancer from "../models/Freelancer.js";
import cloudinary from "../config/cloudinary.js";


// CREATE GIG
export const createGig = async (req, res) => {
  try {
    const { title, description, price, deliveryTime } = req.body;

    const freelancer = await Freelancer.findOne({ user: req.user.id });

    if (!freelancer) {
      return res.status(400).json({ message: "Freelancer profile not found" });
    }

    if (!title || !description || !price || !deliveryTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const images = req.files?.map((file) => ({
      url: file.path,
      public_id: file.filename
    })) || [];

    const gig = await Gigs.create({
      freelancer: freelancer._id,
      title,
      description,
      price: Number(price),
      deliveryTime,
      images
    });

    res.status(201).json({ message: "Gig created successfully", gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET LOGGED-IN FREELANCER GIGS
export const getMyGigs = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.user.id });

    if (!freelancer) {
      return res.status(200).json({ totalResults: 0, gigs: [] });
    }

    const gigs = await Gigs.find({ freelancer: freelancer._id })
      .populate({
        path: "freelancer",
        populate: { path: "user", select: "name email" }
      })
      .select("-__v");

    res.status(200).json({
      totalResults: gigs.length,
      gigs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE GIG
export const updateGig = async (req, res) => {
  try {
    const gig = await Gigs.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(400).json({ message: "Freelancer not found" });

    if (gig.freelancer.toString() !== freelancer._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let newImages = gig.images;

    if (req.files && req.files.length > 0) {
      for (const img of gig.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const updatedGig = await Gigs.findByIdAndUpdate(
      req.params.id,
      { ...req.body, price: Number(req.body.price), images: newImages },
      { new: true }
    );

    res.json({ message: "Gig updated successfully", gig: updatedGig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE GIG
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gigs.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(400).json({ message: "Freelancer not found" });

    if (gig.freelancer.toString() !== freelancer._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    for (const img of gig.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await gig.deleteOne();

    res.json({ message: "Gig deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL GIGS
export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gigs.find()
      .populate({
        path: "freelancer",
        populate: { path: "user", select: "name email" }
      })
      .select("-__v");

    res.status(200).json({ totalResults: gigs.length, gigs });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET GIG BY ID
export const getGigById = async (req, res) => {
  try {
    const gig = await Gigs.findById(req.params.id)
      .populate({
        path: "freelancer",
        populate: { path: "user", select: "name email" }
      })
      .select("-__v");

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
