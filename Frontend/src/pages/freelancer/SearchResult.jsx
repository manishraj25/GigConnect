import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../api/api";
import ProjectCard from "../../components/ProjectCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const tag = searchParams.get("tag") || "";

    const [projects, setProjects] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const navigate=useNavigate();

    // Filters
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [skills, setSkills] = useState("");

    // Fetch projects based on tag
    const fetchProjects = async () => {
        try {
            const res = await API.get(
                `/search/projects?searchTags=${encodeURIComponent(tag)}`
            );

            const openProjects = res.data.filter((p) => p.status === "open");

            setProjects(openProjects);
            setFiltered(openProjects);
        } catch (error) {
            toast.error("Failed to load search results");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [tag]);

    // Apply filters
    const applyFilters = () => {
        let temp = [...projects];

        if (minBudget) {
            temp = temp.filter((p) => p.budget >= Number(minBudget));
        }
        if (maxBudget) {
            temp = temp.filter((p) => p.budget <= Number(maxBudget));
        }
        if (skills) {
            const skillArray = skills.split(",").map((s) => s.trim().toLowerCase());
            temp = temp.filter((p) =>
                p.skillsRequired.some((sk) =>
                    skillArray.includes(sk.toLowerCase())
                )
            );
        }

        setFiltered(temp);
    };

    return (
        <div className="w-full p-6">
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => navigate("/freelancer")}
                    className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                >
                    <ArrowLeft size={22} />
                </button>
                <h1 className="text-2xl font-bold ">
                    Search Results for: <span className="text-blue-500">{tag}</span>
                </h1>
            </div>

            {/* Filter Box */}
            <div className=" bg-white shadow-md p-4 rounded-xl mb-5 mx-8 flex flex-wrap gap-4">

                <div className="flex flex-col">
                    <label className="font-semibold text-sm">Min Budget</label>
                    <input
                        type="number"
                        className="border p-2 rounded-md w-40"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        placeholder="e.g. 1000"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold text-sm">Max Budget</label>
                    <input
                        type="number"
                        className="border p-2 rounded-md w-40"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        placeholder="e.g. 5000"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold text-sm">Skills</label>
                    <input
                        type="text"
                        className="border p-2 rounded-md w-60"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. React, Node, UI/UX"
                    />
                </div>

                <button
                    onClick={applyFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 h-10 self-end"
                >
                    Apply Filters
                </button>
            </div>

            {/* Project Cards Grid */}
            <div className="flex flex-wrap gap-4 w-full px-5 justify-around">
                {filtered.length > 0 ? (
                    filtered.map((project) => (
                        <div className="max-w-1/4 ">
                            <ProjectCard key={project._id} project={project} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No projects found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResult;
