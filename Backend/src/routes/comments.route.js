import express from "express";

import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createComment,
  getComments,
  deleteComment,
} from "../controllers/comment.controller.js";
const router = express.Router();
//public routes
router.get("/post/:postId", getComments);

//protected Routes

router.post("/post/:postId", protectedRoute, createComment);
router.delete("/:commentId", protectedRoute, deleteComment);
export default router;
