import { Router } from "express";
import { register, login, me, roleAvailability, updatePushToken, updateAvatar, validateRole } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/role-availability", roleAvailability);
router.post('/validate-role', authenticate, validateRole);

// Protected route — requires valid JWT
router.get("/me", authenticate, me);
router.post('/push-token', authenticate, updatePushToken)
router.post('/avatar', authenticate, upload.single('avatar'), updateAvatar);

export default router;