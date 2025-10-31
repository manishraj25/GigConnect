import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/api.js";

// Create Context
const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // stores user object {id, name, email, role}
  const [loading, setLoading] = useState(true); 

  // Auto-load user from cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setUser(res.data.user);
    return res.data.user;
  };

  // Signup function
  const signup = async (formData) => {
    const res = await API.post("/auth/register", formData);
    setUser(res.data.user);
    return res.data.user;
  };

  // Logout function
  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
