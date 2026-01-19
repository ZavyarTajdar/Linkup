import { asyncHandler } from '../Utils/asyncHandler';
import { ApiError } from '../Utils/apiError';
import { User } from '../Models/user.model';
import { IUser } from '../Interfaces/user.interface';
import { UploadOnCloudinary } from '../Utils/cloudinary';
import { ApiResponse } from '../Utils/apiResponse';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

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

const registerUser = asyncHandler(async (req : Request, res : Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, 'Username, email, and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'Email is already registered');
    }

    const newUser = await User.create({
        username,
        email,
        password,
    })

    return res
    .status(201)
    .json(new ApiResponse(200, 'User registered successfully', newUser));
})

const loginUser = asyncHandler(async(req: Request, res: Response) => {
    const { username, password } = req.body

    if (!(username && password)) {
        throw new ApiError(400, "username and password is required")
    }

    const user = await User.findOne({username: username}).select('+password')

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

export { 
    registerUser,
    loginUser
};