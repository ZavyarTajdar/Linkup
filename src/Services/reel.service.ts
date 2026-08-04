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