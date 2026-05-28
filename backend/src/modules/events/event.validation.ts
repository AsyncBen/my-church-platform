import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    type: z.string().min(1, "Type is required"),
    accent: z.string().optional().default("#1B3A7A"),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>["body"];