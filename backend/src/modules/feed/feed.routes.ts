import { Router } from "express";
import {
  createPost,
  getAllPosts,
  likePost,
  addComment,
  getComments,
  deletePost,
} from "./feed.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// GET / — authenticate, get all posts
router.get("/", authenticate, getAllPosts);

// POST / — authenticate, create post
router.post("/", authenticate, createPost);

// PATCH /:postId/like — authenticate, like/unlike post
router.patch("/:postId/like", authenticate, likePost);

// GET /:postId/comments — authenticate, get comments
router.get("/:postId/comments", authenticate, getComments);

// POST /:postId/comments — authenticate, add comment
router.post("/:postId/comments", authenticate, addComment);

// DELETE /:postId — authenticate, delete post
router.delete("/:postId", authenticate, deletePost);

export default router;