import Freelancer from "../models/Freelancer.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

//create or update freelancer profile
export const upsertFreelancerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills, headline, searchTags, about, location, portfolio } = req.body;
    let profileImage = {};

    //Upload new profile image if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "freelancer_profiles",
      });
      profileImage = { url: upload.secure_url, public_id: upload.public_id };
    }

    const existingFreelancer = await Freelancer.findOne({ user: userId });

    if (existingFreelancer) {
      //Update existing profile
      if (profileImage.url && existingFreelancer.profileImage.public_id) {
        await cloudinary.uploader.destroy(existingFreelancer.profileImage.public_id);
      }

      existingFreelancer.skills = skills || existingFreelancer.skills;
      existingFreelancer.headline = headline || existingFreelancer.headline;
      existingFreelancer.searchTags = searchTags || existingFreelancer.searchTags;
      existingFreelancer.about = about || existingFreelancer.about;
      existingFreelancer.location = location || existingFreelancer.location;
      existingFreelancer.profileImage = profileImage.url
        ? profileImage
        : existingFreelancer.profileImage;

      await existingFreelancer.save();
      return res.json({
        message: "Freelancer profile updated successfully",
        freelancer: existingFreelancer,
      });
    }

    //Create new profile
    const newFreelancer = await Freelancer.create({
      user: userId,
      skills,
      headline,
      searchTags,
      about,
      location,
      profileImage,
    });

    res.status(201).json({
      message: "Freelancer profile created successfully",
      freelancer: newFreelancer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// upload portfolio item
export const addPortfolioItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { heading, description } = req.body;
    const freelancer = await Freelancer.findOne({ user: userId });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }

    const photos = [];

    //Handle multiple portfolio images safely
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // If Multer uses diskStorage, file.path is available
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "freelancer_portfolio",
        });
        photos.push({ url: upload.secure_url, public_id: upload.public_id });
      }
    }

    // Push new project to portfolio array
    freelancer.portfolio.push({
      heading,
      description,
      photos,
    });

    await freelancer.save();

    res.status(201).json({
      message: "Portfolio item added successfully",
      portfolio: freelancer.portfolio,
    });
  } catch (error) {
    console.error("Error adding portfolio item:", error);
    res.status(500).json({
      message: "Server error while adding portfolio",
      error: error.message,
    });
  }
};

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { heading, description } = req.body;

    const freelancer = await Freelancer.findOne({ user: userId });
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer profile not found" });

    const portfolioItem = freelancer.portfolio.id(id);
    if (!portfolioItem)
      return res.status(404).json({ message: "Portfolio item not found" });

    portfolioItem.heading = heading || portfolioItem.heading;
    portfolioItem.description = description || portfolioItem.description;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "freelancer_portfolio",
        });
        portfolioItem.photos.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }
    }

    await freelancer.save();
    res.status(200).json({
      message: "Portfolio item updated successfully",
      portfolio: freelancer.portfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    res.status(500).json({ message: "Server error while updating portfolio" });
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const freelancer = await Freelancer.findOne({ user: userId });
    if (!freelancer)
      return res.status(404).json({ message: "Freelancer profile not found" });

    const item = freelancer.portfolio.id(id);
    if (!item)
      return res.status(404).json({ message: "Portfolio item not found" });

    // Delete images from Cloudinary
    for (const photo of item.photos) {
      if (photo.public_id) await cloudinary.uploader.destroy(photo.public_id);
    }

    item.deleteOne();
    await freelancer.save();

    res.status(200).json({
      message: "Portfolio item deleted successfully",
      portfolio: freelancer.portfolio,
    });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    res.status(500).json({ message: "Server error while deleting portfolio" });
  }
};


// Get my freelancer profile safely
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const freelancer = await Freelancer.findOne({ user: userId })
      .populate("user", "-password");

    if (!freelancer) {
      return res.status(200).json({
        profileExists: false,
        message: "Freelancer profile not found",
      });
    }

    res.status(200).json({
      profileExists: true,
      freelancer,
    });
  } catch (error) {
    console.error("Error fetching freelancer profile:", error);
    res.status(500).json({ message: error.message });
  }
};


//Update user info (name, email, password)
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.json({ message: "User info updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete freelancer profile
export const deleteFreelancerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const freelancer = await Freelancer.findOne({ user: userId });
    if (!freelancer)
      return res.status(404).json({ message: "Profile not found" });

    // Delete profile image
    if (freelancer.profileImage?.public_id) {
      await cloudinary.uploader.destroy(freelancer.profileImage.public_id);
    }

    // Delete portfolio images
    for (const project of freelancer.portfolio) {
      for (const photo of project.photos) {
        await cloudinary.uploader.destroy(photo.public_id);
      }
    }

    await Freelancer.deleteOne({ user: userId });
    res.json({ message: "Freelancer profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get freelancer profile by ID
export const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id)
      .populate("user", "name email")
      .select("-__v -updatedAt");

    if (!freelancer)
      return res.status(404).json({ message: "Freelancer not found" });

    res.json(freelancer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Save or update freelancer bank details
export const updateBankDetails = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifsc, bankName } = req.body;

    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          "bankDetails.accountHolderName": accountHolderName,
          "bankDetails.accountNumber": accountNumber,
          "bankDetails.ifsc": ifsc,
          "bankDetails.bankName": bankName,
        },
      },
      { new: true }
    );

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      bankDetails: freelancer.bankDetails,
    });
  } catch (error) {
    console.error("Error updating bank details:", error);
    res.status(500).json({ message: "Failed to update bank details" });
  }
};

// Get freelancer bank details
export const getBankDetails = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.user.id }).select("bankDetails");

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.status(200).json({ success: true, bankDetails: freelancer.bankDetails });
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ message: "Failed to fetch bank details" });
  }
};
