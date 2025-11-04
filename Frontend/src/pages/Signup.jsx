import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: location.state?.role || localStorage.getItem("role") || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Watch for navbar role change
  useEffect(() => {
    const newRole = location.state?.role;
    if (newRole && newRole !== formData.role) {
      setFormData((prev) => ({ ...prev, role: newRole }));
      localStorage.setItem("role", newRole);
    }
  }, [location.state?.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Disable button unless all fields are filled
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.role.trim() !== "" &&
    agreeTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const user = await signup(formData);
      if (user.role === "client") navigate("/client");
      else navigate("/freelancerDashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-[92vh] bg-gray-100 w-full pt-10">
      <form
        onSubmit={handleSubmit}
        className="py-14 w-[37vw] bg-gray-100 h-full "
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Signup as{" "}
          <span className="text-green-600">
            {formData.role ? formData.role : " — select role first"}
          </span>
        </h2>

        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          type="text"
          className="border w-full p-2 mb-3 rounded"
          onChange={handleChange}
          value={formData.name}
        />

        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          className="border w-full p-2 mb-3 rounded"
          onChange={handleChange}
          value={formData.email}
        />

        <label className="block text-sm font-medium">Password</label>
        <input
          name="password"
          type="password"
          className="border w-full p-2 mb-3 rounded"
          onChange={handleChange}
          value={formData.password}
        />

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center mt-4 mb-5">
          <input
            id="agree"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2 cursor-pointer"
          />
          <label
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            Yes, I understand and agree to all{" "}
            <span className="text-green-600 hover:underline cursor-pointer">
              Terms of Service
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`block mx-auto w-1/3 py-2 rounded-md transition-colors ${!isFormValid || isSubmitting
              ? "bg-gray-200 text-gray-400 cursor-text"
              : "bg-green-600 text-white hover:bg-green-700"
            }`}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <p className="mt-6 text-sm text-gray-700 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
