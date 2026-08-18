import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { Types } from "mongoose";
import {
    toggleLikeReelService,
} from '../Services/like.service'

export const toggleLikeReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user?._id;

    const { reel, isLiked } = await toggleLikeReelService(reelId as string, userId);
    res.status(200).json(new ApiResponse(200, { reel, isLiked }, "Reel liked/unliked successfully"));
});

