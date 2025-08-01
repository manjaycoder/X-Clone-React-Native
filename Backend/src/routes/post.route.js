import express from "express";

import { createPost, deletePost, getPost, getPosts, getUserPosts, likePost } from "../controllers/post.controller";import { protectedRoute } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
const router = express.Router();
//public routes
router.get("/",getPosts);
router.get("/:postId",getPost);
router.get("/user/:username",getUserPosts)
//protected Protected
router.post("/",protectedRoute,upload.single("image"),createPost)
router.post("/:postId/like",protectedRoute,likePost)
router.delete("/:postId/like",protectedRoute,deletePost);
export default router;
1