import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <h1>I am Login</h1>
        <Link to="/home">Go to Home</Link>
    </div>
  );
}
export default Login;