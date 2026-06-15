import { Types } from 'mongoose';
import { User } from '../Models/user.model';
import { ApiError } from '../Utils/apiError';
import { UploadOnCloudinary } from '../Utils/cloudinary';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';


export const generateAccessAndRefreshTokenService = async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

// ================= REGISTER =================

export const registerUserService = async (data: {
    username: string;
    email: string;
    password: string;
    nickname: string;
    profileImagePath: string;
}) => {
    const { username, email, password, nickname, profileImagePath } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "Email is already registered");
    }

    const uploadedImage = await UploadOnCloudinary(profileImagePath);

    const user = await User.create({
        username,
        email,
        password,
        nickname,
        profileImg: uploadedImage?.url
    });

    return await User.findById(user._id).select("-password -refreshToken");
};

// ================= LOGIN =================

export const loginUserService = async (username: string, password: string) => {
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
        throw new ApiError(400, "Invalid username or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid username or password");
    }

    return user;
};

// ================= UPDATE CREDENTIALS =================

export const updateUserCredentialsService = async (
    userId: string,
    payload: {
        username?: string;
        email?: string;
        nickname?: string;
        oldPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }
) => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (payload.oldPassword) {
        const isCorrect = await user.isPasswordCorrect(payload.oldPassword);

        if (!isCorrect) {
            throw new ApiError(400, "Old password is incorrect");
        }

        if (
            !payload.newPassword ||
            payload.newPassword !== payload.confirmPassword
        ) {
            throw new ApiError(400, "New passwords did not match");
        }

        if (payload.newPassword === payload.oldPassword) {
            throw new ApiError(
                400,
                "New password must be different from old password"
            );
        }

        user.password = payload.newPassword;
    }

    if (payload.username) user.username = payload.username;
    if (payload.email) user.email = payload.email;
    if (payload.nickname) user.nickname = payload.nickname;

    await user.save();

    return await User.findById(userId).select("-password -refreshToken");
};

// ================= UPDATE PROFILE IMAGE =================

export const updateProfileImageService = async (
    userId: string,
    imagePath: string
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const uploaded = await UploadOnCloudinary(imagePath);

    if (!uploaded?.url) {
        throw new ApiError(400, "Image upload failed");
    }

    user.profileImg = uploaded.url;
    await user.save();

    return user;
};

// ================= PROFILE =================

export const getUserProfileService = async (userId: string) => {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;

};

// ================= REFRESH ACCESS TOKEN =================

export const refreshAccessTokenService = async (incommingRefreshToken: string) => {
    try {
        const decodedUser = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET as Secret ) as JwtPayload;
        const user = await User.findById(decodedUser?._id).select("+refreshToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if(incommingRefreshToken !== user.refreshToken){
            throw new ApiError(400, "Token Mismatched!")
        }

        const { refreshToken, accessToken } = await generateAccessAndRefreshTokenService(user._id)

        return { refreshToken, accessToken };
    } catch (error : any) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Refresh Token Expired, Please Login Again");
        } else {
            throw new ApiError(401, "Invalid Refresh Token, Please Login Again");
        }
    }
}

// ================= DELETE USER =================
export const deleteUserService = async (userId: string) => {
    try {
        const user = await User.findByIdAndDelete(userId);
    
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return;
    } catch (error : any) {
        throw new ApiError(500, "Failed to delete user");
    }
}

export const searchUserService = async (search: string) => {

    if (!search) {
        throw new ApiError(400, "Enter name!");
    }

    const users = await User.find({
        $or: [
            { username: { $regex: `^${search}`, $options: "i" } },
            { nickname: { $regex: `^${search}`, $options: "i" } }
        ]
    }).select("username nickname profilePicture");

    return users;
};

export const getUserbyIdService = async (requestedId: Types.ObjectId, userId: Types.ObjectId) => {

    const requestedUser = await User.findById(requestedId);

    if (!requestedUser) {
        throw new ApiError(404, "User not found");
    }

    if (requestedUser.profilePrivacy === "private") {
        if(requestedUser.followers.includes(userId)){
            return requestedUser;
        }else{
            return { 
            username: requestedUser.username, 
            profileImg: requestedUser.profileImg,
            followersCount: requestedUser.followersCount,
            followingsCount: requestedUser.followingsCount,
            postsCount: requestedUser.postsCount,
            profilePrivacy: requestedUser.profilePrivacy,
            message: "You need to follow this user to view their profile" 
            };
        }
    }

    return requestedUser;
};

export const getFollowersService = async (
    userId: Types.ObjectId,
    page: number = 1,
    limit: number = 10
) => {

    const user = await User.findById(userId)
    .populate({
        path: 'followers',
        select: 'username profileImg',
        options: {
            skip: (page - 1) * limit,
            limit: limit,
            sort: { createdAt: -1 } // latest followers first
        }
    });


    if (!user) {
        throw new Error("User not found");
    }

    const totalFollowers = user.followersCount;

    return {
        followers: user.followers,
        page,
        limit,
        totalFollowers
    };
};

export const getFollowingsService = async (
    userId: Types.ObjectId,
    page: number = 1,
    limit: number = 10
) => {
    const user = await User.findById(userId)
        .populate({
            path: 'followings',
            select: 'username profileImg',
            options: {
                skip: (page - 1) * limit,
                limit: limit,
                sort: { createdAt: -1 }
            }
        });

    if (!user) throw new ApiError(404, "User not found");

    return {
        followings: user.followings,
        page,
        limit,
        totalFollowings: user.followingsCount
    };
};

export const getSuggestedUsersService = async( userId: Types.ObjectId, limit: number = 10) => {
    const user = await User.findById(userId).select("followings");

    const excludedUsers = [...user!.followings, userId];

    const suggestedUsers = await User.find({ _id: { $nin: excludedUsers.map(id => id.toString()) } })
        .select("username profileImg")
        .sort({ followersCount: -1 })
        .limit(limit);

    return suggestedUsers;
}

export const getMutualFollowersService = async (userId: Types.ObjectId, otherUserId: Types.ObjectId) => {
    const user = await User.findById(userId).select("followings");
    const otherUser = await User.findById(otherUserId).select("followings");

    if (!user || !otherUser) {
        throw new ApiError(404, "User not found");
    }

    const mutual = user.followings.filter(followingId => otherUser.followings.includes(followingId));

    const mutualUsers = await User.find({ _id: { $in: mutual.map(id => id.toString()) } })
        .select('username profileImg');

    return mutualUsers;
}

export const toggleProfilePrivacyService = async (userId: Types.ObjectId) => {
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");

    if (user.profilePrivacy === "public") {
        user.profilePrivacy = "private";
    } else {
        user.profilePrivacy = "public";
    }
    user.followRequests = [];
    await user.save();
    return user;
}
