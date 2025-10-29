import mongoose from "mongoose";

const gigsSchema = new mongoose.Schema({
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},

    deliveryTime: { type: Number, required: true }, // in days

    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ]
}, { timestamps: true });

const Gigs = mongoose.models.Gigs || mongoose.model("Gigs", gigsSchema);    
export default Gigs;