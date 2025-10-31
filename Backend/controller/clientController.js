import Client from "../models/Client.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js"; // ✅ using your existing config


//create or update client profile
export const upsertClientProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyName, location } = req.body;
    let profileImage = {};

    //Handle image upload if provided
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "client_profiles",
      });
      profileImage = { url: upload.secure_url, public_id: upload.public_id };
    }

    const existingClient = await Client.findOne({ user: userId });

    if (existingClient) {
      //Update existing client profile
      if (profileImage.url && existingClient.profileImage.public_id) {
        await cloudinary.uploader.destroy(existingClient.profileImage.public_id);
      }

      existingClient.companyName = companyName || existingClient.companyName;
      existingClient.location = location || existingClient.location;
      existingClient.profileImage = profileImage.url ? profileImage : existingClient.profileImage;

      await existingClient.save();
      return res.json({ message: "Profile updated successfully", client: existingClient });
    }

    //Create new client profile
    const client = await Client.create({
      user: userId,
      companyName,
      location,
      profileImage,
    });

    res.status(201).json({ message: "Profile created successfully", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get my client profile
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const client = await Client.findOne({ user: userId }).populate("user", "-password");
    if (!client) return res.status(404).json({ message: "Client profile not found" });

    res.json(client);
  } catch (error) {
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
    res.json({ message: "User info updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete client profile
export const deleteClientProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const client = await Client.findOne({ user: userId });
    if (!client) return res.status(404).json({ message: "Profile not found" });

    if (client.profileImage?.public_id) {
      await cloudinary.uploader.destroy(client.profileImage.public_id);
    }

    await Client.deleteOne({ user: userId });
    res.json({ message: "Client profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get client profile by ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("user", "name email")
      .select("-__v -updatedAt");

    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
