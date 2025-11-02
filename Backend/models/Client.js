import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String },
  profileImage: {
    url: { type: String, default: "" },
    public_id: { type: String, default: "" }
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  }
}, { timestamps: true });

const Client = mongoose.model.Client || mongoose.model('Client', clientSchema);
export default Client;
