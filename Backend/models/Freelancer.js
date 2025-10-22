import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  skills: { type: [String], default: [] },
  headline: { type: String },     // short tagline / e.g. "React developer"
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  }
}, { timestamps: true });

const freelancer = mongoose.model.freelancer || mongoose.model('Freelancer', freelancerSchema);
export default freelancer;
