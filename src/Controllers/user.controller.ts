import { asyncHandler } from '../Utils/asyncHandler';
import { ApiError } from '../Utils/apiError';
import { User } from '../Models/user.model';
import { UploadOnCloudinary } from '../Utils/cloudinary';
import { ApiResponse } from '../Utils/apiResponse';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

const registerUser = asyncHandler(async (req, res) => {
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

export { 
    registerUser 
};