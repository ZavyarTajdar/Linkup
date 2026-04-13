import { Types } from "mongoose";

export interface IHome {
    feed: Types.ObjectId[];
    stories: Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}