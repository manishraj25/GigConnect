import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";




const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex justify-center items-center min-h-[90vh] bg-gray-100 w-full">
            <div className=" px-20 py-14 rounded-lg shadow-lg w-[37vw]">
            <form  >
                <h2 className="text-2xl font-semibold mb-6 text-center">Log in to GigConnect</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full hover:fon bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                    Login
                </button>
            </form>
            <div className="flex flex-col items-center mt-20 ">
                <p className="text-center">Don't have an account?</p>
                <Link to="/roles" className="w-1/3 text-center mt-2 text-green-500 border-2 border-green-500  py-1.5 rounded-lg hover:border-green-600 hover:text-green-600">
                    Sign up
                </Link>
            </div>
            </div>
        </div>
    );
}
export default Login;