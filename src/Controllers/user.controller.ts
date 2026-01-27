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
} from "../Services/user.service";


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
        .json(new ApiResponse(201, "User registered successfully", user));
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
            new ApiResponse(200, "Login successful", {
                user,
                accessToken,
                refreshToken,
            }),
        );
});

// ================= LOGOUT =================

export const logoutUser = asyncHandler(async (req, res) => {
    await updateUserCredentialsService(req.user!._id, {});

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, "Logged out successfully", {}));
});

// ================= UPDATE =================

export const updateUserCredentials = asyncHandler(async (req, res) => {
    const user = await updateUserCredentialsService(req.user!._id, req.body);

    return res.json(
        new ApiResponse(200, "Credentials updated successfully", user),
    );
});

// ================= PROFILE IMAGE =================

export const updateProfileImage = asyncHandler(async (req, res) => {
    const imagePath = req.files?.profileImage?.[0]?.path;

    if (!imagePath) {
        throw new ApiError(400, "Image is required");
    }

    const user = await updateProfileImageService(req.user!._id, imagePath);

    return res.json(new ApiResponse(200, "Profile image updated", user));
});

// ================= PROFILE =================

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await getUserProfileService(req.user!._id);

    return res.json(new ApiResponse(200, "Profile fetched successfully", user));
});

// ================= REFRESH ACCESS TOKEN =================

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incommingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const { accessToken, refreshToken } = await refreshAccessTokenService(incommingRefreshToken);

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "Access token refreshed successfully", {
                accessToken,
                refreshToken,
            }),
        );
})

export const deleteUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    await deleteUserService(userId);

    return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully", {}));
});