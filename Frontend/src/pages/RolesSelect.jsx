import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, User } from "lucide-react"; // Icons

const RolesSelect = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

const handleContinue = () => {
    if (!selectedRole) return alert("Please select a role");
    navigate("/signup", { state: { role: selectedRole } });
  };

  return (
    <div className="flex flex-col items-center pt-20 min-h-[92vh] bg-gray-100 px-4">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold mb-10 text-center">
        Join as a client or freelancer
      </h1>

      {/* Role Cards */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">

        {/* Client Card */}
        <div
          onClick={() => setSelectedRole("client")}
          className={`cursor-pointer border-2 rounded-2xl p-6 sm:p-8 w-72 sm:w-76 text-center transition-all duration-200 ${
            selectedRole === "client"
              ? "border-green-600 bg-green-50"
              : "border-gray-500 hover:border-black"
          }`}
        >
          <Briefcase
            className={`mx-auto mb-3 ${
              selectedRole === "client" ? "text-green-600" : "text-gray-600"
            }`}
            size={28}
          />
          <h2 className="text-lg font-medium mb-2">
            I'm a client, hiring for a project
          </h2>
          <input
            type="radio"
            name="role"
            checked={selectedRole === "client"}
            readOnly
            className="accent-green-600 w-5 h-5"
          />
        </div>

        {/* Freelancer Card */}
        <div
          onClick={() => setSelectedRole("freelancer")}
          className={`cursor-pointer border-2 rounded-2xl p-6 sm:p-8 w-72 sm:w-76 text-center transition-all duration-200 ${
            selectedRole === "freelancer"
              ? "border-green-600 bg-green-50"
              : "border-gray-500 hover:border-black"
          }`}
        >
          <User
            className={`mx-auto mb-3 ${
              selectedRole === "freelancer"
                ? "text-green-600"
                : "text-gray-600"
            }`}
            size={28}
          />
          <h2 className="text-lg font-medium mb-2">
            I'm a freelancer, looking for work
          </h2>
          <input
            type="radio"
            name="role"
            checked={selectedRole === "freelancer"}
            readOnly
            className="accent-green-600 w-5 h-5"
          />
        </div>
      </div>

      {/* Create Account Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className={`w-64 py-3 rounded-md font-medium transition ${
          selectedRole
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Create Account
      </button>

      {/* Login link */}
      <p className="mt-6 text-sm text-gray-700">
        Already have an account?{" "}
        <Link to="/login" className="text-green-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default RolesSelect;
