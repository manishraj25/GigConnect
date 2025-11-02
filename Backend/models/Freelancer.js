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

  headline: { type: String, default: "" },

  searchTags: { type: [String], default: [] },

  about: { type: String, default: "" },

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
  },

  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }


}, { timestamps: true });

const Freelancer = mongoose.models.Freelancer || mongoose.model('Freelancer', freelancerSchema);

export default Freelancer;
