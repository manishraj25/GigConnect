import React from "react";
import HowItWorks from "../components/HowItWorks";
import heroImage from "../assets/hero.jpg";
import {Link} from "react-router-dom";

// Home Page Component
const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center w-full">
            
            <section className="relative w-[82vw] h-[84vh] mt-8 rounded-2xl overflow-hidden shadow-lg">
                {/* Background Image */}
                <img
                    src={heroImage}
                    alt="Freelancing workspace"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black opacity-40"></div>

                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center pt-40 pl-10">
                    <div className="   text-white p-8 sm:p-12 rounded-2xl max-w-2xl text-center">
                        <h1 className="text-4xl sm:text-4xl font-bold mb-4 ">
                            Connecting clients in need to freelancers who deliver
                        </h1>
                        <p className="text-lg mb-6">
                            GigConnect — Where clients meet skilled freelancers to make ideas real.
                        </p>
                        <Link to="/roles" className="text-black bg-white rounded-lg px-4 py-2 font-semibold cursor-pointer">Join Now</Link>
                    </div>
                </div>
            </section>

            <HowItWorks />

            <section className="p-10 flex flex-col items-center justify-center gap-12 bg-green-600 text-white rounded-2xl w-[82vw] mb-10 mx-auto">
                    <h1 className="text-6xl font-sans">Freelance services at your <span className="text-gray-400">fingertips</span></h1>
                    <Link to="/roles" className="text-black bg-white rounded-lg px-4 py-2 font-semibold cursor-pointer">Join Now</Link>
            </section>
        </div>
    );
}
export default Home;