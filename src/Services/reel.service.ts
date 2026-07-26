import { Types } from "mongoose";
import { Reel } from "../Models/reel.model";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { UploadOnCloudinary } from "../Utils/cloudinary";
import mongoose from "mongoose";

export const createReelService = async(data: {
    creator: string;
    caption: string;
    thumbnail?: string;
    content: string;
 }) => {
    const { creator, caption, thumbnail, content } = data;
    const user = await User.findById(creator);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const uploadedThumbnail = thumbnail ? await UploadOnCloudinary(thumbnail) : null;
    const uploadContent = await UploadOnCloudinary(content);

    if (!uploadContent?.url) {
        throw new ApiError(400, "Failed to upload reel content");
    }

    const reel = await Reel.create({
        creator,
        caption,
        thumbnail: uploadedThumbnail?.url || uploadContent.url,
        content: uploadContent.url,
    });
    return reel;
}