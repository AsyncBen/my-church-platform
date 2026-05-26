import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    type: z.enum(["ANNOUNCEMENT", "DEVOTIONAL", "SERMON", "TESTIMONY"]),
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Body is required"),
    imageUrl: z.string().optional(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1, "Comment text is required"),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];