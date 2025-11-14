import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Edit, Loader2, Save, X,  Plus} from "lucide-react";
import API from "../../api/api.js";
import toast from "react-hot-toast";

const ClientProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    location: { address: "", city: "", state: "", country: "" },
    profileImage: null,
  });
  const [preview, setPreview] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  // Fetch client profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/clients/me");
        setProfile(res.data);

        if (res.data.profileExists === false) {
          setProfileExists(false);
        } else {
          setProfileExists(true);
          setProfile(res.data);
        }

        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          companyName: res.data.companyName || "",
          location: res.data.location || {
            address: "",
            city: "",
            state: "",
            country: "",
          },
          profileImage: null,
        });
        setPreview(res.data.profileImage?.url || "");
      } catch (error) {
        console.error("Error fetching client profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["address", "city", "state", "country"].includes(name)) {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
    if (file) {
      const newPreview = URL.createObjectURL(file);
      setPreview(newPreview);
    }
  };

  // Save updated profile
  const handleSave = async () => {
    const toastId = toast.loading("Updating profile...");
    try {
      await API.put("/clients/update-user", {
        name: formData.name,
        email: formData.email,
      });

      const formDataToSend = new FormData();
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("location[address]", formData.location.address);
      formDataToSend.append("location[city]", formData.location.city);
      formDataToSend.append("location[state]", formData.location.state);
      formDataToSend.append("location[country]", formData.location.country);

      if (formData.profileImage)
        formDataToSend.append("profileImage", formData.profileImage);

      const res = await API.post("/clients/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data.client);

      const updatedUser = { ...user, name: formData.name, email: formData.email };
      setUser(updatedUser);

      toast.dismiss(toastId);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.dismiss(toastId);
      toast.error("Error updating profile");
    }
  };

  // Delete profile
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await API.delete("/clients/delete");
      toast.success("Profile deleted successfully");
      navigate("/client");
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Error deleting profile");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 ">
        <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
      </div>
    );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/client")}
          className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Client Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Profile Image */}
          <div className="relative flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={preview}
                src={preview || "https://placehold.co/150x150?text=No+Image"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-3 text-sm text-gray-500"
              />
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-3 w-full">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {["address", "city", "state", "country"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-600 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData.location[field]}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-100"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user?.name || "No Name"}
                </h3>
                <p className="text-gray-700">
                  <strong>Company:</strong>{" "}
                  {profile?.companyName || "Not specified"}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong>{" "}
                  {profile?.location
                    ? `${profile.location.address || ""}, ${profile.location.city || ""}, ${profile.location.state || ""}, ${profile.location.country || ""}`
                    : "Not specified"}
                </p>
                <p className="text-gray-700">
                  <strong>Role:</strong> {user?.role}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save size={18} /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {profileExists ? (
                  <>
                    <Edit size={18} /> Edit Profile
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Add Details
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
