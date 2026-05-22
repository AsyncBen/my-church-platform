import { Request, Response, NextFunction } from "express";

type Role = "MEMBER" | "MEDIA" | "SECRETARY" | "PASTOR" | "ADMIN";

/**
 * Usage:
 *   router.get("/reports", authenticate, authorize(["SECRETARY", "PASTOR"]), handler)
 *   router.post("/media/upload", authenticate, authorize(["MEDIA", "ADMIN"]), handler)
 */
export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized — not authenticated" });
      return;
    }

    if (!allowedRoles.includes(user.role as Role)) {
      res.status(403).json({
        success: false,
        message: `Access denied — requires one of: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
};