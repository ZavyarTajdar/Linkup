import mongoose, {Schema, model} from "mongoose";
import { IReel } from "../Interfaces/reel.interface";

const reelSchema = new Schema<IReel>({
    
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },

    video: { 
        type: String,
        required: true
    },

    cover: {
        type: String,
        required : true        
    },

    caption: {
        type: String,
        default: function() {
            const now = new Date();
            return `Reel created on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;    
        }
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
    }],

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],

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

}, { timestamps: true });

reelSchema.index({ creator: 1, createdAt: -1 });
reelSchema.index({ likesCount: -1, viewsCount: -1, commentsCount: -1, savesCount: -1, sharesCount: -1 });

export const Reel = model<IReel>("Reel", reelSchema);
