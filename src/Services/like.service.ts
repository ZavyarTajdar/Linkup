import { Types } from "mongoose";
import { Like } from "../Models/like.model";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { UploadOnCloudinary } from "../Utils/cloudinary";
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