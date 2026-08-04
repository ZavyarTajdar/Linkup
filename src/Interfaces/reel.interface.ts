import { Types } from "mongoose";

export interface IReel {
    _id: string;

    cover: string;
    owner: Types.ObjectId; // userId of the reel owner
    video: string;
    caption: string;
    likes: Types.ObjectId[]; // list of users who have liked the reel
    comments: Types.ObjectId[]; // list of comment IDs associated with the reel

    likesCount: number;
    commentsCount: number;
    savesCount: number;
    viewsCount: number;
    sharesCount: number;
    
    createdAt: Date;
    updatedAt: Date;
}