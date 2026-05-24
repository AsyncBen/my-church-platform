import { Router } from "express";
import { register, login, me, roleAvailability } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/role-availability", roleAvailability);

// Protected route — requires valid JWT
router.get("/me", authenticate, me);

export default router;