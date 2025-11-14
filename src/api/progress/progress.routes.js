import { Router } from "express";
import { updateTutorialStatus } from "./progress.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// Endpoint untuk update status tutorial
// POST /api/progress/tutorials/uuid-tutorial-abc
router.post("/tutorials/:tutorialId", requireAuth, updateTutorialStatus);

export default router;
