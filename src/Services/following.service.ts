import { User } from '../Models/user.model';
import { ApiError } from '../Utils/apiError';
import { Following } from '../Models/following.model';
import { Types } from 'mongoose';

export const followUserService = async (userId: Types.ObjectId, followingId: Types.ObjectId) => {
    const user = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!user || !following) throw new ApiError(404, "User not found");

    const alreadyFollowing = user.followings.some(id => id.equals(followingId));
    if (alreadyFollowing) throw new ApiError(400, "You are already following this user");

    // Add to arrays
    user.followings.push(new Types.ObjectId(following._id));
    following.followers.push(new Types.ObjectId(user._id));

    // Update counts
    user.followingsCount = user.followings.length;
    following.followersCount = following.followers.length;

    await user.save();
    await following.save();

    return {
        message: "Followed successfully",
        followersCount: following.followersCount,
        followingsCount: user.followingsCount
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