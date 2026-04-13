import { Types } from "mongoose";

export interface IComment {
    _id: string;
    author: Types.ObjectId; // userId of the comment author
    post: Types.ObjectId;
    reel: Types.ObjectId;
    story: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}