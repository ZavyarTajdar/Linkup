import mongoose, { Schema, model} from "mongoose";
import { IComment } from "../Interfaces/comment.interface";

const commentSchema = new Schema<IComment>({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    message: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    contentType : {
        type : String,
        enum: ["reel", "post", "story"],
    },
    contentId : {
        type : String,
    }
}, {
    timestamps: true
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;