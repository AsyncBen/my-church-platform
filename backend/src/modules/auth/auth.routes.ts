import { Router } from "express";
import { register, login, me } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route — requires valid JWT
router.get("/me", authenticate, me);

export default router;