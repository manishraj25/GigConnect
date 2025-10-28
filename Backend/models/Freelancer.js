import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },

  profileImage: {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" }
  },
  
  skills: { type: [String], default: [] },

  headline: { type: String }, // Short tagline

  about: { type: String, default: "" }, // Freelancer about section

  portfolio: [
    {
      photos: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true }
        }
      ],
      heading: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],

  location: {
    address: String,
    city: String,
    state: String,
    country: String
  }

}, { timestamps: true });

const Freelancer = mongoose.models.Freelancer || mongoose.model('Freelancer', freelancerSchema);

export default Freelancer;
