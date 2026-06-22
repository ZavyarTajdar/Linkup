import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../Interfaces/user.interface";

const userSchema = new Schema<IUser>(
    {
        nickname: {
            type: String,
            trim: true,
            required: true
        },

        phone: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        profileImg: {
            type: String,
            default:
                "https://res.cloudinary.com/dpsofsi0a/image/upload/v1781461217/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector_qudxco.jpg",
        },

        commentPost: [
            {
                type: String,
            },
        ],

        likePost: [
            {
                type: String,
            },
        ],

        savedPost: [
            {
                type: String,
            },
        ],

        refreshToken: {
            type: String,
        },

        role: {
            type: String,
            enum: ["admin", "creator", "user"],
            default: "user",
        },

        post: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],

        postsCount: {
            type: Number,
            default: 0,
        },

        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],

        followings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],

        followRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        sentFollowRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        isBlocked: {
            type: Boolean,
            default: false,
        },

        profilePrivacy: {
            type: String,
            enum: ["public", "private"],
            default: "private",
        },

        followersCount: {
            type: Number,
            default: 0,
        },

        isVerified: { 
            type: Boolean, 
            default: false 
        },

        bio: { 
            type: String 
        },

        blockedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        followingsCount: {
            type: Number,
            default: 0,
        },

        archivedPost: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],

    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (!this.password) return;
    if (!this.isModified("password")) return;

    this.password = bcrypt.hashSync(this.password, 10);
});


userSchema.methods.isPasswordCorrect = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function (this: IUser) {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            nickname: this.nickname,
        },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
        }
    );
};

userSchema.methods.generateAccessToken = function (this: IUser) {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            nickname: this.nickname,
        },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
        }
    );
};

const User = model<IUser>("User", userSchema);

export { User };