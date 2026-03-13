import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { followUserService, unfollowUserService } from "../Services/following.service";
import { Types } from "mongoose";

// ================= FOLLOW USER =================

export const followUser = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user._id);
    const followingId = new Types.ObjectId(req.params.followingId as string);

    if (!followingId) {
        throw new ApiError(400, "Enter User Id To Follow")
    }

    await followUserService(userId, followingId);
    return res.json(new ApiResponse(200, { message: "User followed successfully" },"User followed successfully",));
})

export const unfollowUser = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user._id);
    const followingId = new Types.ObjectId(req.params.followingId as string);

    if (!followingId) {
        throw new ApiError(400, "Enter User Id To Unfollow")
    }

    await unfollowUserService(userId, followingId);
    return res.json(new ApiResponse(200, "user unfollow Successfully"));
}) 
