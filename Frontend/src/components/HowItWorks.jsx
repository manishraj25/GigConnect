import React, { useState } from "react";
import img1 from "../assets/h1.jpeg";
import img2 from "../assets/h2.jpeg";
import img3 from "../assets/h3.jpeg";
import img4 from "../assets/f1.jpeg";
import img5 from "../assets/f2.jpg";
import img6 from "../assets/f3.jpg";

const HowItWorks = () => {
  const [mode, setMode] = useState("hiring"); // "hiring" or "freelancer"

  const hiringSteps = [
    {
      img: img1,
      title: "Posting jobs is always free",
    },
    {
      img: img2,
      title: "Get proposals and hire",
    },
    {
      img: img3,
      title: "Pay when work is done",
    },
  ];

  const freelancerSteps = [
    {
      img: img4,
      title: "Find clients and remote jobs",
    },
    {
      img: img5,
      title: "Submit proposals and get hired",
    },
    {
      img: img6,
      title: "Get paid as you deliver work",
    },
  ];

  const steps = mode === "hiring" ? hiringSteps : freelancerSteps;

  return (
    <section className="py-10  transition-all duration-300 w-full">
      <div className="w-[82vw] mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h2 className="text-3xl font-bold mb-4 sm:mb-0">How it works</h2>

          <div className="flex  rounded-full border">
            <button
              onClick={() => setMode("hiring")}
              className={`px-5 py-2 font-medium transition ${
                mode === "hiring"
                  ? "rounded-full border-2"
                  : " "
              }`}
            >
              For hiring
            </button>
            <button
              onClick={() => setMode("freelancer")}
              className={`px-5 py-2  font-medium transition ${
                mode === "freelancer"
                  ? "rounded-full border-2"
                  : ""
              }`}
            >
              For finding work
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
            >
              <img
                src={step.img}
                alt={step.title}
                className="rounded-2xl w-full h-48 object-cover mb-4"
              />
              <p className="text-lg font-medium text-gray-800">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
