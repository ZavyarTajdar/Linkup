import { Types } from "mongoose";

interface IUser {
    _id: string;

    nickname: string;
    phone?: number;

    email: string;
    username: string;

    password?: string; // optional now

    profileImg: string;

    commentPost: Types.ObjectId[];
    likePost: Types.ObjectId[];
    savedPost: Types.ObjectId[];
    followers: Types.ObjectId[];
    followings: Types.ObjectId[];

    refreshToken?: string;
    role: string;
    post: Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;

    generateRefreshToken(): string;
    generateAccessToken(): string;
    isPasswordCorrect(password: string): Promise<boolean>;
}


export { IUser };