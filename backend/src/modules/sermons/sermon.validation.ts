import { z } from "zod";

export const createSermonSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    scriptureList: z.array(z.string()).optional(),
    queue: z.array(z.string()).optional(),
  }),
});

export const updateSermonSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    scriptureList: z.array(z.string()).optional(),
    queue: z.array(z.string()).optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["DRAFT", "READY", "DELIVERED"]),
  }),
});

export type CreateSermonInput = z.infer<typeof createSermonSchema>["body"];
export type UpdateSermonInput = z.infer<typeof updateSermonSchema>["body"];