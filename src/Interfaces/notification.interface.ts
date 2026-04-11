import { Types } from "mongoose";

export interface INotification {
    _id: string;
    type: "follow" | "like" | "comment" | "mention";
    sender: Types.ObjectId; // userId of the sender
    receiver: Types.ObjectId; // userId of the receiver
    postId?: Types.ObjectId; // for like, comment, mention
    commentId?: Types.ObjectId; // for comment, mention
    isRead: boolean;
    createdAt: Date;
}