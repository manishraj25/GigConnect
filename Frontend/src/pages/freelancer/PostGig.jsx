import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PostGig = () => {
    const [gigs, setGigs] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [editingGig, setEditingGig] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        deliveryTime: "",
    });

    const [images, setImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [oldImages, setOldImages] = useState([]);

    const navigate =useNavigate();

    const fetchGigs = async () => {
        try {
            const res = await API.get("/gigs/mygigs");
            setGigs(res.data.gigs || []);
        } catch (err) {
            console.error("Error fetching gigs:", err);
            setGigs([]);
        }
    };

    useEffect(() => {
        fetchGigs();
    }, []);

    // Reset states
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            price: "",
            deliveryTime: "",
        });
        setImages([]);
        setOldImages([]);
        setImagePreview([]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle New Image Uploads
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));

        setImages(files);
        setImagePreview(previews);
    };

    // Remove image preview (works for new uploaded images)
    const handleRemoveImage = (index) => {
        const newPreview = [...imagePreview];
        const newFiles = [...images];

        newPreview.splice(index, 1);
        newFiles.splice(index, 1);

        setImagePreview(newPreview);
        setImages(newFiles);
    };

    // Remove OLD Cloudinary Image
    const handleRemoveOldImage = (index) => {
        const updated = [...oldImages];
        updated.splice(index, 1);
        setOldImages(updated);
    };

    // CREATE GIG
    const handleCreateGig = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        images.forEach((img) => data.append("images", img));

        try {
            await API.post("/gigs", data);
            toast.success("Gig posted successfully!");

            setIsModalOpen(false);
            resetForm();
            fetchGigs();
        } catch (err) {
            console.log(err);
            toast.error("Failed to post gig");
        }
    };

    // OPEN EDIT MODAL
    const openEditModal = (gig) => {
        setEditingGig(gig);

        setFormData({
            title: gig.title,
            description: gig.description,
            price: gig.price,
            deliveryTime: gig.deliveryTime,
        });

        // Separate NEW and OLD images properly
        setImages([]);

        const old = gig.images || [];
        setOldImages(old);

        setImagePreview([]);

        setIsEditModalOpen(true);
    };

    // UPDATE GIG
    const handleUpdateGig = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        images.forEach((img) => data.append("images", img));

        oldImages.forEach((img) => data.append("existingImages", img.public_id));

        try {
            await API.put(`/gigs/${editingGig._id}`, data);
            toast.success("Gig updated!");

            setIsEditModalOpen(false);
            resetForm();
            fetchGigs();
        } catch (err) {
            console.log(err);
            toast.error("Failed to update gig");
        }
    };

    const deleteGig = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await API.delete(`/gigs/${id}`);
            toast.success("Gig deleted!");
            fetchGigs();
        } catch (err) {
            toast.error("Failed to delete gig");
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/freelancer")}
                        className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h2 className="text-2xl font-semibold">Manage Gigs</h2>
                </div>

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700"
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    + Post New Gig
                </button>
            </div>

            {/* Gigs List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {gigs.map((gig) => (
                    <div key={gig._id} className="bg-white shadow rounded-lg p-3">
                        <img
                            src={gig?.images?.[0]?.url}
                            alt="gig"
                            className="w-full h-40 object-cover rounded"
                        />

                        <h3 className="font-semibold text-lg mt-2">{gig.title}</h3>
                        <p className="text-sm text-gray-500">{gig.description}</p>

                        <div className="mt-2 flex justify-between text-sm">
                            <span>₹{gig.price}</span>
                            <span>{gig.deliveryTime} days</span>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                onClick={() => openEditModal(gig)}
                            >
                                Edit
                            </button>

                            <button
                                className="bg-red-600 text-white px-3 py-1 rounded"
                                onClick={() => deleteGig(gig._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/*CREATE GIG MODAL*/}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-4">Post New Gig</h2>

                        <form onSubmit={handleCreateGig} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                onChange={handleChange}
                                placeholder="Gig Title"
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <textarea
                                name="description"
                                onChange={handleChange}
                                placeholder="Gig Description"
                                required
                                className="border rounded-lg px-3 py-2 w-full min-h-[100px]"
                            />

                            <input
                                type="number"
                                name="price"
                                onChange={handleChange}
                                placeholder="Price (₹)"
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="number"
                                name="deliveryTime"
                                onChange={handleChange}
                                placeholder="Delivery Time (days)"
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            {/* Image Preview */}
                            <div className="grid grid-cols-3 gap-3">
                                {imagePreview.map((img, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={img}
                                            className="w-full h-24 object-cover rounded-lg border"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(i)}
                                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Post Gig
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT GIG MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-4">Edit Gig</h2>

                        <form onSubmit={handleUpdateGig} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="border rounded-lg px-3 py-2 w-full min-h-[100px]"
                            />

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            <input
                                type="number"
                                name="deliveryTime"
                                value={formData.deliveryTime}
                                onChange={handleChange}
                                required
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            {/* OLD Images (Cloudinary) */}
                            {oldImages.length > 0 && (
                                <>
                                    <p className="font-medium">Existing Images</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {oldImages.map((img, i) => (
                                            <div key={i} className="relative group">
                                                <img
                                                    src={img.url}
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOldImage(i)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Upload New Images */}
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border rounded-lg px-3 py-2 w-full"
                            />

                            {/* NEW Images Preview */}
                            {imagePreview.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {imagePreview.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img
                                                src={img}
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(i)}
                                                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostGig;
