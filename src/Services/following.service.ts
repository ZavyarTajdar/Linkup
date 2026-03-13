import { User } from '../Models/user.model';
import { ApiError } from '../Utils/apiError';
import { Following } from '../Models/following.model';
import { Types } from 'mongoose';

export const followUserService = async (
    userId: Types.ObjectId,
    followingId: Types.ObjectId
) => {

    if (userId.equals(followingId)) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const user = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!user || !following) {
        throw new ApiError(404, "User not found");
    }

    await Following.create({
        follower: userId,
        following: followingId
    });

    await User.updateOne({ _id: userId.toString() }, { $inc: { followingsCount: 1 } });
    await User.updateOne({ _id: followingId.toString() }, { $inc: { followersCount: 1 } });

    user.followings.push(followingId);   // ObjectId directly
    following.followers.push(userId);     // ObjectId directly

    await user.save();
    await following.save();
    return {
        message: "User followed successfully"
    };
};

