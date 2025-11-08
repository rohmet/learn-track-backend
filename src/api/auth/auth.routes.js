import { Router } from "express";
import { register, login } from "./auth.controller.js";

const router = Router();

// Endpoint untuk registrasi
// POST /api/auth/register
router.post("/register", register);

// Endpoint untuk login
// POST /api/auth/login
router.post("/login", login);

export default router;
