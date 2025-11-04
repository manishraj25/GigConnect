import React from "react";
import { Calendar, DollarSign, Briefcase } from "lucide-react";
import DefaultAvatar from "../assets/profile.png"; // 👈 fallback image

const ProjectCard = ({ project }) => {
  const {
    title,
    description,
    skillsRequired = [],
    budget,
    deadline,
    status,
    client,
  } = project;

  const clientName = client?.user?.name || "Unknown Client";
  const clientImage = client?.profileImage?.url || DefaultAvatar;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 p-5 border border-gray-200 cursor-pointer">
      {/* 👤 Client Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={clientImage}
          alt={clientName}
          className="w-8 h-8 rounded-full object-cover border border-gray-300"
        />
        <h4 className="font-medium text-gray-800">{clientName}</h4>
      </div>

      {/* Project Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

      {/* Skills */}
      {skillsRequired?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skillsRequired.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {skillsRequired.length > 4 && (
            <span className="text-gray-400 text-xs">
              +{skillsRequired.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Budget & Deadline */}
      <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span>{budget ? `₹${budget}` : "Budget not specified"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-green-600" />
          <span>
            {deadline ? new Date(deadline).toLocaleDateString() : "No deadline"}
          </span>
        </div>
      </div>

      {/* Status */}
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium ${
          status === "open"
            ? "bg-green-100 text-green-700"
            : status === "in progress"
            ? "bg-yellow-100 text-yellow-700"
            : status === "completed"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        <Briefcase className="w-3 h-3" />
        <span>{status}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
