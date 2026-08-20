import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { Types } from "mongoose";
import {
    toggleLikeReelService,
    toggleLikePostService,
    getOwnlikedContentService,
} from '../Services/like.service'

export const toggleLikeReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user?._id;

    const { isLiked } = await toggleLikeReelService(reelId as string, userId);
    res.status(200).json(new ApiResponse(200, { isLiked }, "Reel liked/unliked successfully"));
});

export const toggleLikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user?._id;

    const { isLiked } = await toggleLikePostService(postId as string, userId);
    res.status(200).json(new ApiResponse(200, { isLiked }, "Post liked/unliked successfully"));
});

export const getOwnlikedContent = asyncHandler(async(req, res) => {
    const userId = req.user?._id

    const user = await getOwnlikedContentService(userId as string)

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User Liked Reel and Post Fetched Successfully")
    )
})