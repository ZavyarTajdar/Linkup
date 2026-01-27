import { Document, Types } from "mongoose";

export interface IPost extends Document {
    owner: Types.ObjectId;
    title: string;
    description: string;
    thumbnail: string;
    pictures: string[];
    videos?: string[];
    views: number;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}
