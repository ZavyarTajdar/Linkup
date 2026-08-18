import { Like } from "../Models/like.model";
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
    const isLiked = reel.likes.includes(new mongoose.Types.ObjectId(userId));
    if(isLiked){
        reel.likes = reel.likes.filter((id) => id.toString() !== new mongoose.Types.ObjectId(userId).toString());
        reel.likesCount--;
        
    } else {
        reel.likes.push(new mongoose.Types.ObjectId(userId));
        reel.likesCount++;
    }
    await reel.save();
    return {
        reel,
        isLiked
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

    const existingLike = await Like.findOne({ post: postId, likedby: userId });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
    
        post.likes = post.likes.filter(
            (likeId) => likeId.toString() !== existingLike._id.toString()
        );
    
        user.likePost = user.likePost.filter(
            (likeId) => likeId.toString() !== existingLike._id.toString()
        );
    
        await Promise.all([
            post.save(),
            user.save()
        ]);
    
        return {
            post,
            isLiked: false
        };
    }
    const like = await Like.create({ post: postId, likedby: userId });
    post.likes.push(like._id);
    user.likePost.push(like._id);
    await Promise.all([post.save(), user.save()]);

    return { post, isLiked: true };
};