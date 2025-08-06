import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import commentRoutes from "./routes/comments.route.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(clerkMiddleware());
app.use(arcjetMiddleware)
// ✅ Routes
app.get("/", (req, res) => res.send("Hello from server"));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = ENV.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server is up and running on PORT: ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
