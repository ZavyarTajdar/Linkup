import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { createPostService, updatePostService, getAllPostsService, fetchPostByIdService, fetchPostsByUserIdService } from "../Services/post.service";
import { Post } from "../Models/post.model";
import { Types } from "mongoose";

export const createPost = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
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

export const updatePost = asyncHandler(async(req, res) => {
    const postId = req.params.postId as string;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await updatePostService(postId, req.body);

    res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
})

export const getAllPosts = asyncHandler(async (req, res) => {
    
    const posts = await getAllPostsService();

    res.status(200).json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

export const fetchPostById = asyncHandler(async(req, res) => {
    const postId = req.params.postId as string;
    
    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }
    const post = await fetchPostByIdService(postId);

    res.status(200).json(new ApiResponse(200, post, "Post retrieved successfully"));
});

export const fetchPostsByUserId = asyncHandler(async(req, res) => {
    const userId = req.params.userId as string;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    const posts = await fetchPostsByUserIdService(userId);

    res.status(200).json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});