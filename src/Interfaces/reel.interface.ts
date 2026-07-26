import { Types } from "mongoose";

export interface IReel {
    _id: string;
    thumbnail: string;
    creator: Types.ObjectId; // userId of the reel creator
    content: string;
    caption: string;
    likes: Types.ObjectId[]; // list of users who have liked the reel
    comments: Types.ObjectId[]; // list of comment IDs associated with the reel
    savedBy: Types.ObjectId[]; // list of users who have saved the reel

    createdAt: Date;
    updatedAt: Date;
}