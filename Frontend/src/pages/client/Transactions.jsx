import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Transactions = () =>{
    const navigate =useNavigate;
    return(
        <div className="flex gap-3">
            <button onClick={() => navigate("/client")}><ArrowLeft/></button>
            <h1>Your Transactions</h1>
        </div>
    )
};
export default Transactions;
