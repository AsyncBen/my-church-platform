import { z } from "zod";

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    category: z
      .enum(["GENERAL", "EVENT", "EMERGENCY", "PRAYER", "OFFERING"])
      .default("GENERAL"),
    scheduledAt: z.string().optional(),
  }),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>["body"];