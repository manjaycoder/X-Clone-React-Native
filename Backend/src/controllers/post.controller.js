import asyncHandler from "express-async-handler";
import POST from "../models/post.model.js";
import User from "../models/user.model.js";


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

export const createPost=asyncHandler(async(req,res)=>{
    const {userId}=getAuth(req)
        const {content}=req.body;
        const imageFile=req.file
        if(!content && !imageFile){
            return res.status(400).json({error:"POST must contain either text or image"})
        }
    const user=await User.findOne({clerkId:userId});
    if(!user) return res.status(404).json({error:"User not found"});
    let imageURL=""

})