import { User } from '../Models/user.model';
import { ApiError } from '../Utils/apiError';
import { Following } from '../Models/following.model';
import { Types } from 'mongoose';

export const followUserService = async (
    userId: Types.ObjectId,
    followingId: Types.ObjectId
  ) => {
    const user = await User.findById(userId);
    const following = await User.findById(followingId);
  
    if (!user || !following) {
      throw new ApiError(404, "User not found");
    }
  
    // ❌ self follow
    if (userId.equals(followingId)) {
      throw new ApiError(400, "You cannot follow yourself");
    }
  
    // ✅ already following
    const alreadyFollowing = user.followings.some(id =>
      id.equals(followingId)
    );
    if (alreadyFollowing) {
      throw new ApiError(400, "Already following this user");
    }
  
    // 🔒 PRIVATE ACCOUNT LOGIC
    if (following.profilePrivacy === "private") {
  
      const alreadyRequested = user.sentFollowRequests.some(id =>
        id.equals(followingId)
      );
  
      if (alreadyRequested) {
        throw new ApiError(400, "Follow request already sent");
      }
  
      // send request
      user.sentFollowRequests.push(followingId);
      following.followRequests.push(userId);
  
      await user.save();
      await following.save();
  
      return {
        type: "request",
        message: "Follow request sent",
      };
    }
  
    // 🌍 PUBLIC ACCOUNT LOGIC
    user.followings.push(followingId);
    following.followers.push(userId);
  
    user.followingsCount = user.followings.length;
    following.followersCount = following.followers.length;
  
    await user.save();
    await following.save();
  
    return {
      type: "follow",
      message: "Followed successfully",
      followersCount: following.followersCount,
      followingsCount: user.followingsCount,
    };
};

export const unfollowUserService = async (
    userId: Types.ObjectId,
    followingId: Types.ObjectId
) => {
    const user = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!user || !following) {
        throw new ApiError(404, "User not found");
    }

    const isFollowing = user.followings.some(id => id.equals(followingId));
    if (!isFollowing) {
        throw new ApiError(400, "You are not following this user");
    }

    // Remove ids from arrays
    user.followings = user.followings.filter(id => !id.equals(followingId));
    following.followers = following.followers.filter(id => !id.equals(userId));

    // Update counts from array length
    user.followingsCount = user.followings.length;
    following.followersCount = following.followers.length;

    await user.save();
    await following.save();

    return {
        message: "Unfollowed successfully",
        followersCount: following.followersCount,
        followingsCount: user.followingsCount
    };
};

export const acceptFollowRequest = async(
    
) => {

}

//todo : ACCEPT FOLLOW REQUEST and Remove follow request, and reject follow req