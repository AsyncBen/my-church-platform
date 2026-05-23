import { z } from "zod";

export const servicePayloadSchema = z.object({
  serviceId: z.string().min(1, "serviceId is required"),
  title:     z.string().min(1, "title is required"),
  startedBy: z.string().optional(),
  startedAt: z.string().optional(),
  endedAt:   z.string().optional(),
});

export const scripturePayloadSchema = z.object({
  reference: z.string().min(1, "reference is required"),
  text:      z.string().min(1, "text is required"),
});

export const announcementPayloadSchema = z.object({
  id:       z.string().min(1, "id is required"),
  title:    z.string().min(1, "title is required"),
  body:     z.string().min(1, "body is required"),
  postedBy: z.string().optional(),
  postedAt: z.string().optional(),
});

// Helper — returns parsed data or throws with a clean message
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join(", ");
    throw new Error(`Validation failed: ${msg}`);
  }
  return result.data;
};