import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const location = useLocation();
  const roleFromState = location.state?.role || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: location.state?.role || localStorage.getItem("role") || "",
  });

  // Save role change to localStorage (for navbar buttons)
  useEffect(() => {
    if (formData.role) localStorage.setItem("role", formData.role);
  }, [formData.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Signup successful!");
    } catch (error) {
      console.error(error);
      alert("Signup failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-md shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input
          name="name"
          type="text"
          placeholder="Name"
          className="border w-full p-2 mb-3 rounded"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3 rounded"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3 rounded"
          onChange={handleChange}
        />

        <p className="text-gray-600 text-sm mb-2">
          Selected role: <span className="font-semibold">{formData.role || "Not selected"}</span>
        </p>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;
