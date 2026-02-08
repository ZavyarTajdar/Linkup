import { Types } from "mongoose";

export interface Ifollowing {
    _id?: Types.ObjectId;

    follower: Types.ObjectId;   // who follows
    following: Types.ObjectId;  // who is being followed

    createdAt?: Date;
    updatedAt?: Date;
}
