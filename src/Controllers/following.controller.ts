import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { 
  followUserService, 
  unfollowUserService, 
  cancelFollowRequestService, 
  rejectFollowRequestService,
  acceptFollowRequestService, 
  removeFollowerService,
  getFollowerRequestsService} from "../Services/following.service";
import { Types } from "mongoose";

// ================= FOLLOW USER =================

export const followUser = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user?._id);
    const followingId = new Types.ObjectId(req.params.followingId as string);
  
    if (!followingId) {
      throw new ApiError(400, "Enter User Id To Follow");
    }
  
    const result = await followUserService(userId, followingId);
  
    return res.json(
      new ApiResponse(
        200,
        result,
        result.message
      )
    );
});

export const cancelFollowRequest = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user?._id);
    const followingId = new Types.ObjectId(req.params.followingId as string);

    if (!followingId) {
        throw new ApiError(400, "Enter User Id To Cancel Follow Request")
    }

      await cancelFollowRequestService(userId, followingId);

    return res.json(new ApiResponse(200, "Follow Request Cancelled Successfully"));
})

export const unfollowUser = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user?._id);
    const followingId = new Types.ObjectId(req.params.followingId as string);

    if (!followingId) {
        throw new ApiError(400, "Enter User Id To Unfollow")
    }

    await unfollowUserService(userId, followingId);
    return res.json(new ApiResponse(200, "user unfollow Successfully"));
}) 

export const rejectFollowRequest = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user?._id);
    const followingId = new Types.ObjectId(req.params.followingId as string);

    if (!followingId) {
        throw new ApiError(400, "Enter User Id To Reject Follow Request")
    }

    await rejectFollowRequestService(userId, followingId);
    return res.json(new ApiResponse(200, "Follow Request Rejected Successfully"));
})

export const acceptFollowRequest = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user?._id);
    const requesterId = new Types.ObjectId(req.params.followingId as string);

    if (!requesterId) {
        throw new ApiError(400, "Enter User Id To Accept Follow Request")
    }
    await acceptFollowRequestService(userId, requesterId);
    
    return res.json(new ApiResponse(200, "Follow Request Accepted Successfully"));
}) 

export const removeFollower = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user?._id);
    const followerId = new Types.ObjectId(req.params.followerId as string);

    if (!followerId) {
        throw new ApiError(400, "Enter User Id To Remove Follower")
    } 

    await removeFollowerService(userId, followerId);
    return res.json(new ApiResponse(200, "Follower Removed Successfully"));
})

export const getFollowerRequests = asyncHandler(async (req, res) => {
    const userId = new Types.ObjectId(req.user?._id);
    const followerRequests = await getFollowerRequestsService(userId);

    return res.json(new ApiResponse(200, followerRequests, "Follower Requests Retrieved Successfully"));
})