import React from "react";
import HowItWorks from "../components/HowItWorks";


const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center w-full">
            {/* ✅ Hero Section */}
            <section className="relative w-[82vw] h-[84vh] mt-8 rounded-2xl overflow-hidden shadow-lg">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
                    alt="Freelancing workspace"
                    className="w-full h-full object-cover"
                />

                {/* Overlapping Tagline Container */}
                <div className="absolute inset-0 flex items-center ">
                    <div className=" bg-opacity-60 text-white p-8 sm:p-12 rounded-2xl max-w-lg text-center shadow-lg">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            Connecting clients in need to freelancers who deliver
                        </h1>
                        <p className="text-lg mb-6">
                            GigConnect — Where clients meet skilled freelancers to make ideas real.
                        </p>
                    </div>
                </div>
            </section>
            <HowItWorks />
        </div>
    );
}
export default Home;