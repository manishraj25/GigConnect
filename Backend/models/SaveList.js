import mongoose from "mongoose";

const saveListSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // client who saves the gig
    required: true
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gigs", // gig posted by freelancer
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

const SaveList = mongoose.models.SaveList || mongoose.model("SaveList", saveListSchema);
export default SaveList;
