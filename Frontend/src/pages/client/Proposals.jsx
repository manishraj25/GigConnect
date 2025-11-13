import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Proposals = () =>{
    const navigate =useNavigate();
    return(
        <div className="flex gap-3">
            <button onClick={() => navigate("/client/postproject")}><ArrowLeft/></button>
            <h1>Proposals</h1>
        </div>
    )
};
export default Proposals;
