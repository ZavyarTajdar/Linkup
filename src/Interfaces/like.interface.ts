import { Types } from "mongoose";

export interface ILike {
    post: Types.ObjectId;
    comment: Types.ObjectId;
    reel: Types.ObjectId;    
    likedby : Types.ObjectId;
}