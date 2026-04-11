import mongoose, { Types } from "mongoose";

export interface IStory {
    _id: string;
    owner: Types.ObjectId; // userId of the story creator
    mediaUrl: string; // URL of the story media (image/video)
    mediaType: "image" | "video"; // type of the media
    viewers: Types.ObjectId[]; // list of users who have viewed the story
    expiresAt: Date; // when the story will expire
    createdAt: Date;
}