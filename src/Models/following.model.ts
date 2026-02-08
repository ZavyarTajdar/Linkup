import { Schema, model } from "mongoose";
import { Ifollowing } from "../Interfaces/following.interface";

const followingSchema = new Schema<Ifollowing>(
{
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
{ timestamps: true }
);

// prevent duplicate follows
followingSchema.index(
  { follower: 1, following: 1 },
  { unique: true }
);

export const Following = model<Ifollowing>("Following", followingSchema);
