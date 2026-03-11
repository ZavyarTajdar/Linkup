import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { followUserService } from "../Services/following.service";
import { Types } from "mongoose";

// ================= FOLLOW USER =================

const followUser = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user._id);
    const followingId = new Types.ObjectId(req.params.followingId as string);

    await followUserService(userId, followingId);
    return res.json(new ApiResponse(200, "User followed successfully", { message: "User followed successfully" }));
})

export { 
    followUser
}