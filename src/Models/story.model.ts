import mongoose , { Schema, model } from "mongoose";
import { IStory } from "../Interfaces/story.interface";

const storySchema: Schema = new Schema<IStory>({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mediaUrl: {
        type: String,
        required: true,
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    viewers: {
        type: [mongoose.Types.ObjectId],
        ref: "User",
        default: [],
    },
}, { timestamps: true });

export const Story = model<IStory>("Story", storySchema);