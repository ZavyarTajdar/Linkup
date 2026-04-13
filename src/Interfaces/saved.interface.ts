import { Types } from "mongoose";

export interface ISaved {
    _id: string;
    
    postId: Types.ObjectId[];
    reelId: Types.ObjectId[];
    userId: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}