import mongoose, { model, Schema } from "mongoose";
import { IPost } from "../Interfaces/post.interface";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
            required : true        
        },
        content: [{
            type: String,
            required: true
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
        }],
        isArchived: {
            type: Boolean,
            default: false
        },
        likesCount: {
            type: Number,
            default: 0
        },
    
        commentsCount: {
            type: Number,
            default: 0
        },
    
        savesCount: {
            type: Number,
            default: 0
        },
    
        viewsCount: {
            type: Number,
            default: 0
        },
    
        sharesCount: {
            type: Number,
            default: 0
        }
    }, 
    { 
        timestamps: true 
    }
);

PostSchema.plugin(mongooseAggregatePaginate);

export const Post = model<IPost>("Post", PostSchema);