import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import API from "../../api/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedProjects = () => {
    const [savedProjects, setSavedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSaved = async () => {
        try {
            setLoading(true);
            const res = await API.get("/savelist/saved/projects", {
                withCredentials: true,
            });

            setSavedProjects(
                res.data.savedProjects ||
                res.data.savedGigs ||
                []
            );
        } catch (error) {
            console.error("Error fetching saved projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
            <div className="w-full">

                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
                    <button
                        onClick={() => navigate("/freelancer")}
                        className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                    >
                        <ArrowLeft size={22} />
                    </button> Saved Projects
                </h2>

                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading saved projects...</p>
                    </div>
                )}

                {!loading && savedProjects.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-xl text-gray-600">You haven’t saved any projects yet..</p>
                    </div>
                )}

                {!loading && savedProjects.length > 0 && (
                    <div className="flex flex-wrap gap-6">
                        {savedProjects.map((item) => (
                            <div key={item._id} className="w-1/4">
                                <ProjectCard project={item.project} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedProjects;
