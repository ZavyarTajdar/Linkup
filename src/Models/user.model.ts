import { Schema, model} from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { IUser } from "../Interfaces/user.interface";

const userSchema = new Schema<IUser>(
    {
        nickname: {
            type: String,
            trim: true,
            required : true
        },

        phone: {
            type: Number,
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
                "https://res.cloudinary.com/dpsofsi0a/image/upload/v1768381071/download_tiwsxx.png",
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

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },

        role: {
            type: String,
            enum: ["admin", "creator", "user"],
            default: "user",
        },

        post: [
            {
                type: String,
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