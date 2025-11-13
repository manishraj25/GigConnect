import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Edit, Trash2, Eye, X } from "lucide-react";
import API from "../../api/api.js";

const PostProject = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showClosed, setShowClosed] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skillsRequired: "",
        budget: "",
        deadline: "",
        searchTags: "", // NEW FIELD
    });

    // Fetch client projects
    const fetchProjects = async () => {
        try {
            const res = await API.get("/projects/client");
            setProjects(res.data.projects || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Submit create/update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const data = {
                ...formData,
                skillsRequired: formData.skillsRequired
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),

                searchTags: formData.searchTags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };

            if (editId) {
                await API.put(`/projects/${editId}`, data);
            } else {
                await API.post("/projects", data);
            }

            resetForm();
            fetchProjects();
        } catch (err) {
            console.error("Error saving project:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            skillsRequired: "",
            budget: "",
            deadline: "",
            searchTags: "",
        });
        setEditId(null);
        setShowModal(false);
    };

    // Edit project
    const handleEdit = (project) => {
        setEditId(project._id);
        setFormData({
            title: project.title,
            description: project.description,
            skillsRequired: project.skillsRequired.join(", "),
            budget: project.budget,
            deadline: project.deadline.split("T")[0],
            searchTags: project.searchTags?.join(", ") || "",
        });
        setShowModal(true);
    };

    // Delete project
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await API.delete(`/projects/${id}`);
            fetchProjects();
        } catch (err) {
            console.error("Error deleting project:", err);
        }
    };

    // Status Update
    const handleStatusChange = async (id, newStatus) => {
        try {
            await API.put(`/projects/${id}`, { status: newStatus });
            fetchProjects();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/client")}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    >
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-semibold">Your Projects</h1>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    <PlusCircle size={18} /> Post New Project
                </button>
            </div>

            {/* Project Listing */}
            {projects.length === 0 ? (
                <p className="text-gray-500">You haven’t posted any projects yet.</p>
            ) : (
                <div className="space-y-10">

                    {/* Active Projects */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 bg-gray-200 rounded-lg p-3">
                            Active Projects
                        </h2>

                        {projects.filter((p) => p.status !== "Closed").length === 0 ? (
                            <p className="text-gray-500">No active projects found.</p>
                        ) : (
                            <div className="grid gap-4">
                                {projects
                                    .filter((p) => p.status !== "Closed")
                                    .map((project) => (
                                        <div
                                            key={project._id}
                                            className="p-5 bg-white rounded-lg shadow hover:shadow-md transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                {/* Info */}
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {project.description}
                                                    </p>

                                                    <div className="text-sm text-gray-500 mt-1">
                                                        Budget: ₹{project.budget} |
                                                        Deadline:{" "}
                                                        {new Date(project.deadline).toLocaleDateString()}
                                                    </div>

                                                    {/* Skills & Tags */}
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {project.searchTags?.map((tag, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Status */}
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">
                                                            Status:
                                                        </span>
                                                        <select
                                                            value={project.status}
                                                            onChange={(e) =>
                                                                handleStatusChange(project._id, e.target.value)
                                                            }
                                                            className="border rounded-lg px-2 py-1 text-sm"
                                                        >
                                                            <option value="Open">Open</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="Closed">Closed</option>
                                                        </select>
                                                    </div>

                                                    {/* Proposals */}
                                                    <button
                                                        onClick={() => navigate(`/client/proposals`)}
                                                        className="mt-3 flex items-center gap-1 text-blue-600 text-sm hover:underline"
                                                    >
                                                        <Eye size={16} /> View Proposals
                                                    </button>
                                                </div>

                                                {/* Edit/Delete */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project._id)}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Closed Projects */}
                    <div>
                        <div
                            onClick={() => setShowClosed(!showClosed)}
                            className="flex justify-between bg-gray-200 p-3 rounded-lg cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold">Closed Projects</h2>
                            <span className="text-gray-600 text-sm">
                                {showClosed ? "▲ Hide" : "▼ Show"}
                            </span>
                        </div>

                        {showClosed && (
                            <div className="mt-4 grid gap-4">
                                {projects
                                    .filter((p) => p.status === "Closed")
                                    .map((project) => (
                                        <div className="flex justify-between p-5 bg-gray-100 rounded-lg shadow">
                                            <div
                                                key={project._id}
                                                className=""
                                            >
                                                <h3 className="font-semibold text-lg text-gray-700">
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm line-clamp-2">
                                                    {project.description}
                                                </p>

                                                <div className="text-sm text-gray-600 mt-1">
                                                    Budget: ₹{project.budget} |
                                                    Deadline:{" "}
                                                    {new Date(project.deadline).toLocaleDateString()}
                                                </div>

                                                <p className="mt-2 text-sm text-gray-700">
                                                    <span className="font-medium">Status:</span> Closed
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="mt-2 p-2 h-9 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
                        <button
                            onClick={resetForm}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-semibold mb-4">
                            {editId ? "Edit Project" : "Post New Project"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Project Title"
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Project Description"
                                required
                                className="border rounded-lg px-3 py-2 w-full min-h-[100px]"
                            />

                            <input
                                type="text"
                                name="skillsRequired"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                placeholder="Skills (comma separated)"
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="text"
                                name="searchTags"
                                value={formData.searchTags}
                                onChange={handleChange}
                                placeholder="Search Tags (comma separated)"
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                placeholder="Budget (₹)"
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    {loading
                                        ? "Saving..."
                                        : editId
                                            ? "Update Project"
                                            : "Post Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostProject;
