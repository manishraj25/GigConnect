import React, { useState } from "react";

const HowItWorks = () => {
  const [mode, setMode] = useState("hiring"); // "hiring" or "freelancer"

  const hiringSteps = [
    {
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      title: "Posting jobs is always free",
    },
    {
      img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
      title: "Get proposals and hire",
    },
    {
      img: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      title: "Pay when work is done",
    },
  ];

  const freelancerSteps = [
    {
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      title: "Find clients and remote jobs",
    },
    {
      img: "https://images.unsplash.com/photo-1603570419875-7c01c4b9cfb4",
      title: "Submit proposals and get hired",
    },
    {
      img: "https://images.unsplash.com/photo-1592496001020-5c3bffb67c57",
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

        {/* Cards */}
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
