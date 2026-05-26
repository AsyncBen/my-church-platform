import { Router, Request, Response } from "express";
import { upload } from "../../middleware/upload.middleware";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// POST /upload — authenticate, upload single image
router.post("/", authenticate, upload.single("image"), (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No image file provided" });
      return;
    }

    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(201).json({
      success: true,
      data: {
        url,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    res.status(400).json({ success: false, message });
  }
});

export default router;