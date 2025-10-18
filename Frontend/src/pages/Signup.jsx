import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {  
    return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <h1>I am Signup</h1>
        <Link to="/home">Go to Home</Link>
    </div>
  );
}
export default Signup;