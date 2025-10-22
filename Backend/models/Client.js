import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String },
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  }
}, { timestamps: true });

const client = mongoose.model.client || mongoose.model('Client', clientSchema);
export default client;
