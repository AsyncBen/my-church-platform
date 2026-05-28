import { Request, Response } from "express";
import {
  createSermonNote,
  getUserSermonNotes,
  getSermonNoteById,
  updateSermonNote,
  deleteSermonNote,
} from "./sermon-note.service";
import { createSermonNoteSchema, updateSermonNoteSchema } from "./sermon-note.validation";
import { ZodError } from "zod";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const parsed = createSermonNoteSchema.parse({ body: req.body });
    const note = await createSermonNote(userId, parsed.body);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(422).json({ success: false, message: err.issues });
      return;
    }
    const message = err instanceof Error ? err.message : "Failed to create note";
    res.status(400).json({ success: false, message });
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const sermonId = req.query.sermonId as string | undefined;
    const notes = await getUserSermonNotes(userId, sermonId);
    res.json({ success: true, data: notes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch notes";
    res.status(400).json({ success: false, message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const note = await getSermonNoteById(req.params.id, userId);
    res.json({ success: true, data: note });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch note";
    res.status(404).json({ success: false, message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const parsed = updateSermonNoteSchema.parse({ body: req.body });
    const note = await updateSermonNote(req.params.id, userId, parsed.body);
    res.json({ success: true, data: note });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(422).json({ success: false, message: err.issues });
      return;
    }
    const message = err instanceof Error ? err.message : "Failed to update note";
    res.status(400).json({ success: false, message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    await deleteSermonNote(req.params.id, userId);
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete note";
    res.status(400).json({ success: false, message });
  }
};