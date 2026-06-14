import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { createPostService, updatePostService } from "../Services/post.service";
import { Post } from "../Models/post.model";

const createPost = asyncHandler(async (req, res) => {
    const { title, description, thumbnail } = req.body;
    const owner = req.user?._id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const content = files?.content ? (files.content as Express.Multer.File[]).map(file => file.path) : [];
    if (!title || !description || !content) {
        throw new ApiError(400, "Title, description, and content are required");
    }

    const thumbnailPath = files?.thumbnail ? (files.thumbnail as Express.Multer.File[])[0].path : undefined;
    const post = await createPostService({ owner, title, description, thumbnail: thumbnailPath, content });

    res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

const updatePost = asyncHandler(async(req, res) => {
    const { title, description, thumbnail } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const thumbnailPath = files?.thumbnail ? (files.thumbnail as Express.Multer.File[])[0].path : undefined;
    const post = await updatePostService({ title, description, thumbnail: thumbnailPath });

    res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
})
// todo : finishing rhti hai  
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate("owner", "username nickname")
    res.status(200).json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

export { createPost, updatePost, getAllPosts };