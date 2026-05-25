import { Request, Response } from "express";
import * as announcementService from "./announcement.service";
import { createAnnouncementSchema } from "./announcement.validation";

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = createAnnouncementSchema.safeParse(req);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: validation.error.issues[0].message,
      });
      return;
    }

    const result = await announcementService.createAnnouncement(validation.data.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const result = await announcementService.getAllAnnouncements();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const sendAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await announcementService.sendAnnouncement(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await announcementService.deleteAnnouncement(id);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};