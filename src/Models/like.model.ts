import moongose, { Schema, model } from "mongoose";
import { ILike } from '../Interfaces/like.interface';

const likeSchema = new Schema<ILike>(
    {

        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },

        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },

        reel: {
            type: Schema.Types.ObjectId,
            ref: "Reel",
        },

        likedby: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    }, 
    { 
        timestamps: true 
    }
);

export const Like = model<ILike>("Like", likeSchema);
