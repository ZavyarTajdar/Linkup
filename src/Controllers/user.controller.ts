import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";

import {
    registerUserService,
    loginUserService,
    generateAccessAndRefreshTokenService,
    updateUserCredentialsService,
    updateProfileImageService,
    getUserProfileService,
    refreshAccessTokenService,
    deleteUserService,
    searchUserService,
    getFollowersService,
    getFollowingsService,
    getSuggestedUsersService,
    getMutualFollowersService
} from "../Services/user.service";

import { User } from "../Models/user.model";
import { Types } from "mongoose";


// ================= REGISTER =================

export const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, nickname } = req.body;

    if (!username || !email || !password || !nickname) {
        throw new ApiError(400, "All fields are required");
    }

    const profileImagePath = req.files?.profileImg?.[0]?.path;

    if (!profileImagePath) {
        throw new ApiError(400, "Profile image is required");
    }

    const user = await registerUserService({
        username,
        email,
        password,
        nickname,
        profileImagePath,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, user, "User registered successfully")
        );
});


// ================= LOGIN =================

export const loginUser = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password required");
    }

    const user = await loginUserService(username, password);

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokenService(user._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken,
                    refreshToken
                },
                "Login successful"
            )
        );
});


// ================= LOGOUT =================

export const logoutUser = asyncHandler(async (req, res) => {

    await updateUserCredentialsService(req.user!._id, {});

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new ApiResponse(200, {}, "Logged out successfully")
        );
});


// ================= UPDATE USER =================

export const updateUserCredentials = asyncHandler(async (req, res) => {

    const user = await updateUserCredentialsService(req.user!._id, req.body);

    return res.json(
        new ApiResponse(200, user, "Credentials updated successfully")
    );
});


// ================= PROFILE IMAGE =================

export const updateProfileImage = asyncHandler(async (req, res) => {

    const imagePath = req.files?.profileImage?.[0]?.path;

    if (!imagePath) {
        throw new ApiError(400, "Image is required");
    }

    const user = await updateProfileImageService(req.user!._id, imagePath);

    return res.json(
        new ApiResponse(200, user, "Profile image updated")
    );
});


// ================= GET PROFILE =================

export const getUserProfile = asyncHandler(async (req, res) => {

    const user = await getUserProfileService(req.user!._id);

    return res.json(
        new ApiResponse(200, user, "Profile fetched successfully")
    );
});


// ================= REFRESH ACCESS TOKEN =================

export const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const { accessToken, refreshToken } =
        await refreshAccessTokenService(incomingRefreshToken);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken,
                },
                "Access token refreshed successfully"
            )
        );
});


// ================= DELETE ACCOUNT =================

export const deleteUserAccount = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    await deleteUserService(userId);

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "User deleted successfully")
        );
});


// ================= SEARCH USER =================

export const searchUser = asyncHandler(async (req, res) => {

    const { q } = req.query;

    if (typeof q !== "string") {
        throw new ApiError(400, "Invalid search query");
    }

    const users = await searchUserService(q);

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "Users fetched successfully")
        );
});


// ================= SEARCH USER BY ID =================

export const searchById = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(404, "Enter ID correctly");
    }

    const user = await User.findById(userId).select("-refreshToken");

    if (!user) {
        throw new ApiError(404, "User doesn't exist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User fetched successfully")
        );
});


// ================= GET FOLLOWERS =================

export const getFollowers = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const followersList = await getFollowersService(userId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                followersList,
                "Followers list fetched successfully"
            )
        );
});

export const getFollowing = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const followingList = await getFollowingsService(userId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                followingList,
                "Following list fetched successfully"
            )
        );
});

export const getSuggestedUsers = asyncHandler(async (req, res) =>{
    const userId = req.user._id;
    const Users = await getSuggestedUsersService(userId);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                Users,
                "Suggested users fetched successfully"
            )
        );
})

export const getMutualFollowers = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const otherUserId = new Types.ObjectId(req.params.otherUserId as string);
    const users = await getMutualFollowersService(userId, otherUserId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                users,
                "Mutual followers fetched successfully"
            )
        );
});

