import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import Comment from "./routes/comments.route.js"
const app = express();
app.use(cors());

app.use(clerkMiddleware());
app.get("/", (req, res) => res.send("Hello from server"));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments",Comment)
app.use((err, req, res) => {
  console.error("UnHandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log("Server is up and running on PORT:", ENV.PORT)
    );
  } catch (error) {
    console.log("Failed to start server", error.message);
    process.exit(1);
  }
};
startServer();
