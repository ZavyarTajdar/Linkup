import { Types } from "mongoose";

export interface IPost {
    owner: Types.ObjectId;
    title: string;
    description: string;
    thumbnail: string;
    content: string[];
    isArchived: boolean;
    views: number;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}
