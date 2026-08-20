import { User } from "../Models/user.model";
import { Post } from "../Models/post.model";
import { ApiError } from "../Utils/apiError";
import mongoose from "mongoose";
import { Reel } from "../Models/reel.model";

export const toggleLikeReelService = async(reelId: string, userId: string) => {
    const reel = await Reel.findById(reelId);
    if(!reel){
        throw new ApiError(404, "Reel Does Not Exist")
    }
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User Not Found")
    }
    const existingLike = reel.likedBy.includes(new mongoose.Types.ObjectId(userId));
    if(existingLike){
        reel.likedBy = reel.likedBy.filter((id) => id.toString() !== new mongoose.Types.ObjectId(userId).toString());
        reel.likesCount--;
        user.likeReel = user.likeReel.filter(
            (id) => id.toString() !== reelId
        );
    } else {
        reel.likedBy.push(new mongoose.Types.ObjectId(userId));
        reel.likesCount++;
        user.likeReel.push(new mongoose.Types.ObjectId(reelId));
    }
    await reel.save();
    await user.save();
    return {
        isLiked: !existingLike
    };
}

export const toggleLikePostService = async (postId: string, userId: string) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post Does Not Exist");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    const existingLike = post.likedBy.includes(new mongoose.Types.ObjectId(userId));

    if (existingLike) {
        post.likedBy = post.likedBy.filter((id) => id.toString() !== new mongoose.Types.ObjectId(userId).toString());
        post.likesCount--;
        user.likePost = user.likePost.filter(
            (id) => id.toString() !== postId
        );
    }else {
        post.likedBy.push(new mongoose.Types.ObjectId(userId));
        post.likesCount++;
        user.likePost.push(new mongoose.Types.ObjectId(postId));
    }
    await post.save();
    await user.save();
    return {
        isLiked: !existingLike
    };
};

export const getOwnlikedContentService = async (userId:string) => {
    const user = await User.findById(userId).select('likePost likeReel')

    if (!user) {
        throw new ApiError(404, "User not exist")
    }

    return user;
}