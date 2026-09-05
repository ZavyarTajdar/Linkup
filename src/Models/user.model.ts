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
        bio: { 
            type: String 
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

        // ***

        archivedPost: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        commentPost: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        likePost: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        likeReel: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reel",
            },
        ],
        SaveCollection:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Saved",
        }],
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
        blockedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        // ****

        isBlocked: {
            type: Boolean,
            default: false,
        },
        isVerified: { 
            type: Boolean, 
            default: false 
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
        followingsCount: {
            type: Number,
            default: 0,
        },
        postsCount: {
            type: Number,
            default: 0,
        },

        // ****

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
        reel:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reel",
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