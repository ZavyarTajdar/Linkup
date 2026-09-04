import mongoose, {model, Schema} from "mongoose";
import { ISaved } from "../Interfaces/saved.interface";

const savedSchema: Schema = new Schema<ISaved>({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    postId: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post'
    }],
    reelId: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reel'
    }]
},{timestamps: true});

const Saved = model<ISaved>('Saved', savedSchema);

export { Saved };