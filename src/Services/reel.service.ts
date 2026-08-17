import { Types } from "mongoose";
import { Reel } from "../Models/reel.model";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { UploadOnCloudinary } from "../Utils/cloudinary";
import mongoose from "mongoose";

export const createReelService = async(data: {
    owner: string;
    caption: string;
    cover?: string;
    video: string;
 }) => {
    const { owner, caption, cover, video } = data;
    const user = await User.findById(owner);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const uploadedCover = cover ? await UploadOnCloudinary(cover) : null;
    const uploadVideo = await UploadOnCloudinary(video);

    if (!uploadVideo?.url) {
        throw new ApiError(400, "Failed to upload reel content");
    }

    const reel = await Reel.create({
        owner,
        caption,
        cover: uploadedCover?.url || uploadVideo.url,
        video: uploadVideo.url,
    });
    return reel;
}

export const getAllCreatorReelsService = async() => {
    const reels = await Reel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $match: {
                "owner.profilePrivacy": "public",
                "owner.role": "creator"
            }
        },
        {
            $sort: {
                "owner.followersCount": -1,
                createdAt: -1,
                likesCount: -1,
                viewsCount: -1,
                commentsCount: -1,
                sharesCount: -1
            }
        },
        {
            $project: {
                caption: 1,
                cover: 1,
                video: 1,
                createdAt: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    nickname: "$owner.nickname",
                    followersCount: "$owner.followersCount"
                }
            }
        }
    ]);
    return reels;
}

export const getAllFollowingReelsService = async(userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const reels = await Reel.find({ owner: { $in: user.followings } }).populate("owner", "username nickname followersCount");
    return reels;
}

export const getReelByIdService = async(userId : string , reelId: string) => {
    const reel = await Reel.findById(reelId).populate("owner", "username nickname followersCount");

    if (!reel) {
        throw new ApiError(404, "Reel Does Not Exist!");
    }
    
    const owner = reel.owner as any;

    const isOwner = owner._id.equals(userId);

    const isFollower = owner.followers.some((id: any) =>
        id.equals(userId)
    );

    if (owner.profilePrivacy === "private" && !isOwner && !isFollower) {
        throw new ApiError(403, "Only followers can view this post!");
    }   
    // Increment the view count
    const updatedreel = await Reel.findByIdAndUpdate(
        reelId,
        { $inc: { views: 1 } },
        { returnDocument: "after" }
    ).populate("owner", "username nickname profileImg profilePrivacy followers");

    return reel;
}

export const updateReelService = async(reelId: string, data: {
    caption?: string;
    cover?: string;
}) => {
    const reel = await Reel.findByIdAndUpdate(reelId, data, { new: true }).populate("owner", "username nickname followersCount");
    if(!reel){
        throw new ApiError(404, "Reel Does Not Exist")
    }
    return reel;
}   

export const deleteReelService = async(reelId: string) => {
    const reel = await Reel.findByIdAndDelete(reelId);
    if(!reel){
        throw new ApiError(404, "Reel Does Not Exist")
    }
    return reel;
}

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

export const getUserReelsService = async (userId: string) => {

    const user = await User.findById(userId)
        .populate("reel", "_id video cover caption likesCount commentsCount savesCount viewsCount sharesCount createdAt");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};