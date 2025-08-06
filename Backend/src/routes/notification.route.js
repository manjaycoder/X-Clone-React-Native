import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";
const router = express.Router();

router.get("/", protectedRoute, getNotification);
router.delete("/:notificationId", protectedRoute, deleteNotification);
export default router;
