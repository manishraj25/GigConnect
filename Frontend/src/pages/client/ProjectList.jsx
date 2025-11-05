import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProjectList = () =>{
    const navigate =useNavigate;
    return(
        <div className="flex gap-3">
            <button onClick={() => navigate("/client")}><ArrowLeft/></button>
            <h1>Your Project Briefs</h1>
        </div>
    )
};
export default ProjectList;
