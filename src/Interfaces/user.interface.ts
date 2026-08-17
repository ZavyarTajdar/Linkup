import { Types } from "mongoose";

interface IUser {
    _id: string;

    nickname: string;
    phone?: string;
    bio?: string;
    email: string;
    username: string;
    password: string; 
    profileImg: string;

    archivedPost: Types.ObjectId[];
    commentPost: Types.ObjectId[];
    likePost: Types.ObjectId[];
    savedPost: Types.ObjectId[];
    followers: Types.ObjectId[];
    followings: Types.ObjectId[];
    followRequests: Types.ObjectId[]        // incoming requests
    sentFollowRequests: Types.ObjectId[]    // outgoing requests
    blockedUsers: Types.ObjectId[];

    isBlocked: boolean;
    isVerified: boolean;
    profilePrivacy: "public" | "private";
    followersCount: number;
    followingsCount: number;
    postsCount: number;

    refreshToken?: string;
    role: string;
    post: Types.ObjectId[];
    reel : Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;

    generateRefreshToken(): string;
    generateAccessToken(): string;
    isPasswordCorrect(password: string): Promise<boolean>;
}


export { IUser };