import { z } from "zod";

export const scriptureSearchSchema = z.object({
  query: z.string().min(1, "search query is required"),
  version: z.enum(["kjv", "api-bible"]).default("kjv"),
});

export const scriptureReferenceSchema = z.object({
  reference: z.string().min(1, "reference is required"),
  version: z.enum(["kjv", "api-bible"]).default("kjv"),
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
