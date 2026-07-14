import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { Post } from "../Models/post.model";
import { Types } from "mongoose";
import { 
    createReelService, 
    updateReelService,
} from "../Services/reel.service"

export const createReel = asyncHandler(async (req, res) => {
    const creator = req.user!._id;
    const { caption } = req.body;

    if (!req.file?.path) {
        throw new ApiError(400, "Reel content is required");
    }

    const reel = await createReelService({
        creator,
        content: req.file.path,
        caption,
    });

    return res.status(201).json(
        new ApiResponse(201, reel, "Reel created successfully")
    );
});

export const updateReel = asyncHandler(async(req, res) => {
    const reelId = req.params.reelId as string;

    if (!reelId) {
        throw new ApiError(400, "Post ID is required");
    }

    const reel = await updateReelService(reelId, req.body);

    res.status(200).json(new ApiResponse(200, reel, "Reel updated successfully"));
})