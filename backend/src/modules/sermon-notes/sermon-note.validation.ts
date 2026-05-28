import { z } from "zod";

export const createSermonNoteSchema = z.object({
  body: z.object({
    sermonId: z.string().optional(),
    title: z.string().min(1),
    scripture: z.string().optional(),
    content: z.string().min(1),
  }),
});

export const updateSermonNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    scripture: z.string().optional(),
    content: z.string().min(1).optional(),
  }),
});

export type CreateSermonNoteInput = z.infer<typeof createSermonNoteSchema>["body"];
export type UpdateSermonNoteInput = z.infer<typeof updateSermonNoteSchema>["body"];