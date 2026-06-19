import { Types } from "mongoose";
import { Post } from "../Models/post.model";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { UploadOnCloudinary } from "../Utils/cloudinary";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const createPostService = async (data: {
    owner: string;
    title: string;
    description: string;
    thumbnail?: string;
    content: string[];
}) => {
    const { owner, title, description, thumbnail, content } = data;

    const user = await User.findById(owner);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const uploadedThumbnail = thumbnail
        ? await UploadOnCloudinary(thumbnail)
        : null;

    const uploadContent = await Promise.all(
        content.map(file => UploadOnCloudinary(file))
    );

    if (uploadContent.some(upload => !upload?.url)) {
        throw new ApiError(400, "Failed to upload content");
    }

    const post = await Post.create({
        owner: user._id,
        title,
        description,
        thumbnail: uploadedThumbnail?.url || uploadContent[0]?.url,
        content: uploadContent.map(upload => upload!.url)
    });

    await User.updateOne({
        _id: user._id
    }, {
        $push: { post: post._id },
        $inc: { postCount: 1 }
    });

    await user.save();

    return post;
};

export const updatePostService = async (
    postId: string,
    data: {
        title?: string;
        description?: string;
    }
) => {
    const { title, description } = data;

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            title,
            description
        },
        {
            new: true
        }
    );

    return post;
}

export const getAllPostsService = async () => {
    const posts = await Post.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $match: {
                "owner.profilePrivacy": "public"
            }
        },
        {
            $sort: {
                "owner.followersCount": -1,
                createdAt: -1
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                createdAt: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    nickname: "$owner.nickname",
                    followersCount: "$owner.followersCount"
                }
            }
        }
    ]);
    return posts;
}
// Todo : Comment bhi populate krne hain
export const fetchPostByIdService = async(postId: string) => {
    const post = await Post.findById(postId).populate("owner", "username nickname profileImg")

    if(!post){
        throw new ApiError(404, "Post Does Not Exist!")
    }

    return post
}

export const fetchPostsByUserIdService = async (userId: string) => {
    const posts = await Post.find({ owner: new Types.ObjectId(userId) }).populate("owner", "username nickname profileImg").sort({ createdAt: -1 });

    if (!posts) {
        throw new ApiError(404, "No posts found for this user");
    }

    return posts;
};

