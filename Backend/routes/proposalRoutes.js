import express from "express";
import {
  submitProposal,
  getProposalsForProject,
  getMyProposals,
  updateProposalStatus
} from "../controller/proposalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Freelancer submits proposal
router.post("/:projectId", protect, submitProposal);

// Client gets all proposals for a project
router.get("/project/:projectId", protect, getProposalsForProject);

// Freelancer gets all their proposals
router.get("/my", protect, getMyProposals);

// Client updates proposal status (accept/reject)
router.put("/:proposalId", protect, updateProposalStatus);

export default router;
