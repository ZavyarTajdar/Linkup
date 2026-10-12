import { Types } from "mongoose";

export interface IComment {
    _id: string;
    author: Types.ObjectId; // userId of the comment author
    message: string;
    likesCount: number;
    replies: Types.ObjectId[];
    contentType : "reel" | "post" | "story";
    edited?: boolean;
    contentId : string;
    createdAt: Date;
    updatedAt: Date;
}