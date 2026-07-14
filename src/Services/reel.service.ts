import { Types } from "mongoose";
import { Reel } from "../Models/reel.model";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { UploadOnCloudinary } from "../Utils/cloudinary";
import mongoose from "mongoose";

export const createReelService = async (data: {
    creator: string;
    content: string;
    caption: string;
}) => {
    const { creator, content, caption } = data;

    const user = await User.findById(creator);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const uploadedReel = await UploadOnCloudinary(content);

    if (!uploadedReel?.url) {
        throw new ApiError(400, "Failed to upload reel");
    }

    const reel = await Reel.create({
        creator: user._id,
        content: uploadedReel.url,
        caption,
    });

    await User.updateOne(
        { _id: user._id },
        {
            $push: { reel: reel._id },
            $inc: { reelCount: 1 },
        }
    );

    return reel;
};

export const updateReelService = async (
    reelId: string,
    data: {
        caption?: string;
    }
 ) => {
    const { caption } = data;

    const reel = await Reel.findByIdAndUpdate(
        reelId,
        {
            caption
        },
        {
            new: true
        }
    );

    return reel;
}