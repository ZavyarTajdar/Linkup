import mongoose, {Schema, model} from "mongoose";
import { IReel } from "../Interfaces/reel.interface";

const reelSchema = new Schema<IReel>({
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    content: { 
        type: String,
        required: true
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
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
});

export const Reel = model<IReel>("Reel", reelSchema);
