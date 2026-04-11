import mongoose, { Schema, model } from "mongoose";
import { INotification } from "../Interfaces/notification.interface";

const notificationSchema = new Schema<INotification>({
    type: {
        type: String,
        enum: ["follow", "like", "comment", "mention"],
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Notification = model<INotification>("Notification", notificationSchema);