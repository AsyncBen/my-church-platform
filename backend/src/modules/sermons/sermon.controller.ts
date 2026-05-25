import { Request, Response } from "express";
import * as sermonService from "./sermon.service";
import {
  createSermonSchema,
  updateSermonSchema,
  updateStatusSchema,
} from "./sermon.validation";

export const createSermon = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = createSermonSchema.safeParse(req);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      });
      return;
    }

    const pastorName = req.user?.email || "Unknown";
    const result = await sermonService.createSermon(validation.data.body, pastorName);

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllSermons = async (req: Request, res: Response) => {
  try {
    const result = await sermonService.getAllSermons();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSermonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await sermonService.getSermonById(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSermon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate request body
    const validation = updateSermonSchema.safeParse(req);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      });
      return;
    }

    const result = await sermonService.updateSermon(id, validation.data.body);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSermonStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate request body
    const validation = updateStatusSchema.safeParse(req);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      });
      return;
    }

    const result = await sermonService.updateSermonStatus(
      id,
      validation.data.body.status
    );
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSermon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await sermonService.deleteSermon(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};