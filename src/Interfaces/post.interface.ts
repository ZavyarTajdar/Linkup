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

    likesCount: number;
    commentsCount: number;
    savesCount: number;
    viewsCount: number;
    sharesCount: number;

    createdAt: Date;
    updatedAt: Date;
}
