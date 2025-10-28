import Proposal from "../models/Proposal.js";
import ProjectPost from "../models/ProjectPost.js";

// ✅ Submit proposal (freelancer)
export const submitProposal = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { coverLetter, proposedBudget, proposedDeadline } = req.body;
    const freelancer = req.user._id;

    const project = await ProjectPost.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const alreadyExists = await Proposal.findOne({ project: projectId, freelancer });
    if (alreadyExists) return res.status(400).json({ message: "Proposal already submitted" });

    const proposal = await Proposal.create({
      project: projectId,
      freelancer,
      coverLetter,
      proposedBudget,
      proposedDeadline
    });

    res.status(201).json({ message: "Proposal submitted successfully", proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all proposals for a project (client)
export const getProposalsForProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const proposals = await Proposal.find({ project: projectId })
      .populate("freelancer", "name skills")
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get freelancer’s proposals
export const getMyProposals = async (req, res) => {
  try {
    const freelancer = req.user._id;
    const proposals = await Proposal.find({ freelancer })
      .populate("project", "title budget status");
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update proposal status (client only)
export const updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status } = req.body; // accepted | rejected

    const proposal = await Proposal.findById(proposalId).populate("project");
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    if (proposal.project.client.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    proposal.status = status;
    await proposal.save();

    res.json({ message: `Proposal ${status}`, proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
