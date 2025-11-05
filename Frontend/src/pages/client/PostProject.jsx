import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PostProject = () =>{
    const navigate =useNavigate;
    return(
        <div className="flex gap-3">
            <button onClick={() => navigate("/client")}><ArrowLeft/></button>
            <h1>Post Your Project</h1>
        </div>
    )
};
export default PostProject;
