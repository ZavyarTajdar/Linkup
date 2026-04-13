import mongoose, { Schema, model} from "mongoose";
import { IComment } from "../Interfaces/comment.interface";

const commentSchema = new Schema<IComment>({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    post: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post" 
    },
    reel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Reel" 
    },
    story: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Story" 
    }
}, {
    timestamps: true
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;