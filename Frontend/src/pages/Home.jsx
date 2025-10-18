import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <h1>I am home</h1>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
    </div>
  );
}
export default Home;