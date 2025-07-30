import express from "express";
import { getPost, getPosts } from "../controllers/post.controller";
import { protectedRoute } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
const router = express.Router();
//public routes
router.get("/",getPosts);
router.get("/:postId",getPost);
router.get("/user/:username",getUserPosts)
//protected Protected
router.post("/",protectedRoute,upload.single("image"),createPost)
export default router;
