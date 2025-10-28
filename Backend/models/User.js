import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpiry: { type: Number ,default: 0},
  isVerified: { type: Boolean, default: false },
  resetPasswordOtp: { type: String, default: '' },
  resetPasswordOtpExpiry: { type: Number, default: 0}
}, { timestamps: true });

const User = mongoose.model.user || mongoose.model('user', userSchema);
export default User;
