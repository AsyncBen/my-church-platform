import { z } from "zod";

export const createPrayerSchema = z.object({
  body: z.object({
    text: z.string().min(5, "Prayer must be at least 5 characters"),
    category: z.string().default("Personal"),
    isAnonymous: z.boolean().default(false),
  }),
});

export const praySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type CreatePrayerInput = z.infer<typeof createPrayerSchema>["body"];