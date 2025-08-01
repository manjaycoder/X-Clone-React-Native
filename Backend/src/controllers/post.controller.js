import asyncHandler from "express-async-handler";
import POST from "../models/post.model.js";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await POST.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });
  res.status(200).json({ posts });
});
export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const POST = await POST.findById(postId)
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });
  if (!POST) return res.status(404).json({ error: "POST not found " });
  res.status(200).json({ POST });
});
export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await POST.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts });
});

export const createPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;
  if (!content && !imageFile) {
    return res
      .status(400)
      .json({ error: "POST must contain either text or image" });
  }
  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });
  let imageURL = "";
});
export const likePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);
  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });
  const isLiked = post.likes.includes(user._id);
  if (isLiked) {
    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    });
  } else {
    //like
    await Post.findByIdAndUpdate(postId, {
      $push: { likes: user._id },
    });
    //create notification if not liking own post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: "like",
        post: postId,
      });
    }
  }
});
export const deletePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findByIdd(postId);
  if (!user || !post)
    return res
      .status(403)
      .json({ error: "You can only delete your own posts" });
  //delete all comments on this post

  await Comment.deleteMany({ post: postId });
  //delete the post
  await Post.findByIdAndDelete(postId);
  res.status(200).json({ message: "Post deleted successfully" });
});
