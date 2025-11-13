import mongoose from "mongoose";

const projectPostSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    searchTags: { type: [String], default: [] },
    status: { type: String, enum: ['open', 'in progress', 'completed', 'closed'], default: 'open' }
}, { timestamps: true });

const ProjectPost = mongoose.models.ProjectPost || mongoose.model("ProjectPost", projectPostSchema);

export default ProjectPost;