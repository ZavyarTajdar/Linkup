import mongoose, { model, Schema } from "mongoose";
import { IPost } from "../Interfaces/post.interface";

const PostSchema = new Schema<IPost>(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 150
        },
        description: {
            type: String,
            maxlength: 200,
            default: ""
        },
        thumbnail: {
            type: String,
            required: true
        },
        pictures: [{
            type: String,
            required: true
        }],
        videos: [{
            type: String
        }],
        views: {
            type: Number,
            default: 0
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]

    }, 
    { 
        timestamps: true 
    }
);

export const Post = model<IPost>("Post", PostSchema);