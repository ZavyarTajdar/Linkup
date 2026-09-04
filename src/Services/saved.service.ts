import { ISaved } from "../Interfaces/saved.interface";
import { Post } from "../Models/post.model";
import { Reel } from "../Models/reel.model";
import { ApiError } from "../Utils/apiError";
import { Saved } from "../Models/saved.model";
import { Types } from "mongoose";
import { User } from "../Models/user.model";

export const savePostService = async (
    userId: string,
    postId?: string,
    reelId?: string
): Promise<ISaved> => {

    if (!postId && !reelId) {
        throw new ApiError(400, "Post or reel ID is required");
    }

    if (postId) {
        const post = await Post.findById(postId);

        if (!post) {
            throw new ApiError(404, "Post not found");
        }
    }

    if (reelId) {
        const reel = await Reel.findById(reelId);

        if (!reel) {
            throw new ApiError(404, "Reel not found");
        }
    }

    const saved = await Saved.create({
        userId,
        postId: postId ? [new Types.ObjectId(postId)] : [],
        reelId: reelId ? [new Types.ObjectId(reelId)] : [],
    });

    await User.findByIdAndUpdate(userId, {
        $push: {
            savedContent: saved._id,
        },
    });

    return saved;
};