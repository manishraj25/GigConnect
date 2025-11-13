import mongoose from "mongoose";

const saveListSchema = new mongoose.Schema({
  // Who saved the item (can be client or freelancer)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Saved Gig (client saving freelancer’s gig)
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gigs",
    default: null
  },

  // Saved Project (freelancer saving client’s project)
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectPost",
    default: null
  },

  savedAt: {
    type: Date,
    default: Date.now,
  }
});

// A user cannot save the same gig or project twice
saveListSchema.index(
  { user: 1, gig: 1, project: 1 },
  { unique: true }
);

const SaveList =
  mongoose.models.SaveList || mongoose.model("SaveList", saveListSchema);
export default SaveList;
