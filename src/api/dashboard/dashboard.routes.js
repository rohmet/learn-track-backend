import { Router } from "express";
import { getMyDashboard } from "./dashboard.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// Endpoint untuk dashboard utama
// GET /api/dashboard
router.get("/", requireAuth, getMyDashboard);

export default router;
