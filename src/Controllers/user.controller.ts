import { asyncHandler } from '../Utils/asyncHandler';
import { ApiError } from '../Utils/apiError';
import { User } from '../Models/user.model';
import { IUser } from '../Interfaces/user.interface';
import { UploadOnCloudinary } from '../Utils/cloudinary';
import { ApiResponse } from '../Utils/apiResponse';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth_request';


export const generateAcessAndRefreshToken = async (userId: string) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(504, "Something went wrong while generating Acess And Refresh Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, nickname } = req.body;

    if (!username || !email || !password || !nickname) {
        throw new ApiError(400, 'Username, email, nickname and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'Email is already registered');
    }

    const profileImagelocalPath = req.files?.profileImg[0]?.path

    if (!profileImagelocalPath) {
        throw new ApiError(400, "Profile image is required");
    }
    
    const profileImage = await UploadOnCloudinary(profileImagelocalPath)
    
    if (!profileImage?.url) {
        throw new ApiError(400, "Failed to upload on cloudinary")
    }
    
    const newUser = await User.create({
        username,
        email,
        nickname,
        password,
        profileImg: profileImage.url
    })

    const user = await User.findById(newUser._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(500, "Something Went Wrong While Fetching User");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, 'User registered successfully', user));
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!(username && password)) {
        throw new ApiError(400, "username and password is required")
    }

    const user = await User.findOne({ username: username }).select('+password')

    if (!user) {
        throw new ApiError(400, "password or username is not vaild")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password is not valid")
    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select('-refreshToken -password')

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, 'User Login successfully', { user: loggedInUser, accessToken, refreshToken })
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    if (!user) {
        throw new ApiError(400, 'User is not logged in')
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, "User Logged Out Successfully", {})
        )
})

const updateUserCredentials = asyncHandler(async (req, res) => {
    const { username, email, nickname, oldPassword, newPassword, confirmPassword } = req.body;

    if (!username && !email && !nickname && !oldPassword) {
        throw new ApiError(400, "Update at least one field");
    }

    const user = await User.findById(req.user?._id).select("+password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (oldPassword) {
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Old password is incorrect");
        }

        if (!newPassword || !confirmPassword) {
            throw new ApiError(400, "New password and confirm password are required");
        }

        if (newPassword !== confirmPassword) {
            throw new ApiError(400, "New password must match confirm password");
        }

        user.password = newPassword; 
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (nickname) user.nickname = nickname;

    await user.save();

    user.password = undefined;

    return res.status(200).json(
        new ApiResponse(200, "User credentials updated successfully", user)
    );
});

const updateProfileImage = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(400, "User is not Logged In")
    }

    const imageLocalPath = req.files?.profileImage[0].path

    if (!imageLocalPath) {
        throw new ApiError(400, "Image Is Required")
    }

    const profileImage = await UploadOnCloudinary(imageLocalPath)

    if (!profileImage) {
        throw new ApiError(400, "Failed To Upload On Cloudinary")
    }

    user.profileImg = profileImage.url
    await user.save()

    return res.status(200).json(
        new ApiResponse(200, "User ProfileImage updated successfully", user)
    );
})


export {
    registerUser,
    loginUser,
    logoutUser,
    updateUserCredentials,
    updateProfileImage
};