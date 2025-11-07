import React, { useState, useEffect } from "react";
import API from "../../api/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

const FreelancerProfile = () => {
  const [freelancer, setFreelancer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    heading: "",
    description: "",
    photos: [],
  });
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const navigate = useNavigate();

  // Fetch freelancer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/freelancers/me");
        setFreelancer(res.data);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // Upload new profile image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      setLoading(true);
      await API.post("/freelancers/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile image updated");
      window.location.reload();
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // Inline editing handlers
  const handleChange = (field, value) => {
    setFreelancer((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (subField, value) => {
    setFreelancer((prev) => ({
      ...prev,
      location: { ...prev.location, [subField]: value },
    }));
  };

  // Save edited profile
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await API.post("/freelancers/profile", freelancer);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Portfolio handlers
  const openPortfolioModal = (item = null) => {
    if (item) {
      setEditingPortfolioId(item._id);
      setPortfolioData({
        heading: item.heading,
        description: item.description,
        photos: [],
      });
    } else {
      setEditingPortfolioId(null);
      setPortfolioData({ heading: "", description: "", photos: [] });
    }
    setShowPortfolioModal(true);
  };

  const handlePortfolioChange = (field, value) => {
    setPortfolioData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePortfolioFileChange = (e) => {
    setPortfolioData((prev) => ({
      ...prev,
      photos: Array.from(e.target.files),
    }));
  };

  const handleSavePortfolio = async () => {
    if (!portfolioData.heading || !portfolioData.description) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("heading", portfolioData.heading);
    formData.append("description", portfolioData.description);
    portfolioData.photos.forEach((file) =>
      formData.append("portfolioImages", file)
    );

    try {
      setLoading(true);
      const url = editingPortfolioId
        ? `/freelancers/portfolio/${editingPortfolioId}`
        : "/freelancers/portfolio";
      const method = editingPortfolioId ? "put" : "post";
      const res = await API[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFreelancer((prev) => ({ ...prev, portfolio: res.data.portfolio }));
      setShowPortfolioModal(false);
      toast.success(editingPortfolioId ? "Project updated" : "Project added");
    } catch {
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await API.delete(`/freelancers/portfolio/${id}`);
      setFreelancer((prev) => ({
        ...prev,
        portfolio: res.data.portfolio,
      }));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  if (!freelancer) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 my-2 ml-60">
        <button
          onClick={() => navigate("/freelancer")}
          className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Freelancer Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={freelancer.profileImage?.url || "/default-profile.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-green-500"
            />
            <label
              htmlFor="profileUpload"
              className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </label>
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex justify-between w-5/6">
            <div className="flex-1 space-y-3">
              <h1 className="text-2xl font-bold">{freelancer.user?.name}</h1>
              {isEditing ? (
                <input
                  value={freelancer.headline || ""}
                  onChange={(e) => handleChange("headline", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Add headline"
                />
              ) : (
                <p className="text-green-700 font-semibold">
                  {freelancer.headline || "No headline yet"}
                </p>
              )}
            </div>
            <button
              onClick={() =>
                isEditing ? handleSaveProfile() : setIsEditing(true)
              }
              disabled={loading}
              className="h-10 px-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {isEditing ? "Save" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* About */}
        <div>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          {isEditing ? (
            <textarea
              value={freelancer.about || ""}
              onChange={(e) => handleChange("about", e.target.value)}
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Write something about yourself..."
            />
          ) : (
            <p className="text-gray-700">
              {freelancer.about || "No about section added yet."}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          {isEditing ? (
            <input
              value={freelancer.skills?.join(", ") || ""}
              onChange={(e) =>
                handleChange(
                  "skills",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              className="w-full border rounded p-2"
              placeholder="Add skills separated by commas"
            />
          ) : freelancer.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </div>

        {/* Search Tags */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">Search Tags</h3>
          {isEditing ? (
            <input
              value={freelancer.searchTags?.join(", ") || ""}
              onChange={(e) =>
                handleChange(
                  "searchTags",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              className="w-full border rounded p-2"
              placeholder="Enter search tags separated by commas"
            />
          ) : freelancer.searchTags?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {freelancer.searchTags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No search tags available.</p>
          )}
        </div>

        {/* Address */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Address</h2>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-3">
              <input
                value={freelancer.location?.address || ""}
                onChange={(e) => handleLocationChange("address", e.target.value)}
                className="border rounded p-2"
                placeholder="Address"
              />
              <input
                value={freelancer.location?.city || ""}
                onChange={(e) => handleLocationChange("city", e.target.value)}
                className="border rounded p-2"
                placeholder="City"
              />
              <input
                value={freelancer.location?.state || ""}
                onChange={(e) => handleLocationChange("state", e.target.value)}
                className="border rounded p-2"
                placeholder="State"
              />
              <input
                value={freelancer.location?.country || ""}
                onChange={(e) => handleLocationChange("country", e.target.value)}
                className="border rounded p-2"
                placeholder="Country"
              />
            </div>
          ) : (
            <p className="text-gray-600">
              {freelancer.location
                ? `${freelancer.location.address || ""}, ${freelancer.location.city || ""}, ${freelancer.location.state || ""}, ${freelancer.location.country || ""}`
                : "No address added"}
            </p>
          )}
        </div>

        {/* Portfolio */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Portfolio</h2>
            <button
              onClick={() => openPortfolioModal()}
              className="bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700"
            >
              +Add Project
            </button>
          </div>

          {freelancer.portfolio?.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {freelancer.portfolio.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-3 shadow-sm hover:shadow-md transition relative"
                >
                  {item.photos?.[0]?.url && (
                    <img
                      src={item.photos[0].url}
                      alt={item.heading}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                  )}
                  <h3 className="font-bold">{item.heading}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openPortfolioModal(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePortfolio(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No portfolio items yet.</p>
          )}
        </div>
      </div>

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowPortfolioModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">
              {editingPortfolioId ? "Edit Project" : "Add Project"}
            </h2>

            <input
              type="text"
              value={portfolioData.heading}
              onChange={(e) => handlePortfolioChange("heading", e.target.value)}
              placeholder="Project Title"
              className="w-full border rounded p-2 mb-3"
            />
            <textarea
              value={portfolioData.description}
              onChange={(e) =>
                handlePortfolioChange("description", e.target.value)
              }
              placeholder="Project Description"
              className="w-full border rounded p-2 mb-3"
              rows={3}
            />
            <input
              type="file"
              multiple
              onChange={handlePortfolioFileChange}
              className="mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePortfolio}
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {editingPortfolioId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreelancerProfile;
