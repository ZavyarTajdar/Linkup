import { Types } from "mongoose";
import { Post } from "../Models/post.model";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { UploadOnCloudinary } from "../Utils/cloudinary";
import mongoose from "mongoose";

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
export const fetchPostByIdService = async (postId: string, userId: string) => {
    const post = await Post.findById(postId)
        .populate("owner", "username nickname profileImg profilePrivacy followers");

    if (!post) {
        throw new ApiError(404, "Post Does Not Exist!");
    }

    const owner = post.owner as any;

    const isOwner = owner._id.equals(userId);

    const isFollower = owner.followers.some((id: any) =>
        id.equals(userId)
    );

    if (owner.profilePrivacy === "private" && !isOwner && !isFollower) {
        throw new ApiError(403, "Only followers can view this post!");
    }   
    // Increment the view count
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { views: 1 } },
        { returnDocument: "after" }
    ).populate("owner", "username nickname profileImg profilePrivacy followers");

    return updatedPost;
};

export const fetchPostsByUserIdService = async (userId: string, viewerId: string) => {
    const ownerId = new Types.ObjectId(userId);

    const posts = await Post.find({ owner: ownerId })
        .populate("owner", "username nickname profileImg profilePrivacy followers")
        .sort({ createdAt: -1 });

    if (!posts.length) {
        throw new ApiError(404, "No posts found for this user");
    }

    const owner = posts[0].owner as any;

    const isOwner = owner._id.equals(viewerId);

    const isFollower = owner.followers?.some((id: any) =>
        id.equals(viewerId)
    );

    if (owner.profilePrivacy === "private" && !isOwner && !isFollower) {
        throw new ApiError(403, "Only followers can view this user's posts!");
    }

    return posts;
};

export const deletePostService = async (postId: string, userId: string) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== userId) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }

    await Post.findByIdAndDelete(postId);

    await User.updateOne(
        { _id: userId },
        {
            $pull: { post: post._id },
            $inc: { postCount: -1 }
        }
    );

    return post;
};

export const archivePostService = async (postId: string, userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const post = await Post.findById(postId).session(session);

        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        if (post.owner.toString() !== userId) {
            throw new ApiError(403, "Not authorized");
        }

        if (post.isArchived) {
            throw new ApiError(400, "Post already archived");
        }

        await User.updateOne(
            { _id: userId },
            {
                $pull: { post: post._id },
                $push: { archivedPost: post._id },
                $inc: { postCount: -1 }
            },
            { session }
        );

        post.isArchived = true;
        await post.save({ session });

        await session.commitTransaction();
        session.endSession();

        return post;

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};

export const unarchivePostService = async (postId: string, userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const post = await Post.findOne({
            _id: postId,
            owner: userId
        }).session(session);

        if (!post) {
            throw new ApiError(404, "Post not found or not authorized");
        }

        if (!post.isArchived) {
            throw new ApiError(400, "Post is not archived");
        }

        await User.updateOne(
            { _id: userId },
            {
                $pull: { archivedPost: post._id },
                $push: { post: post._id },
                $inc: { postCount: 1 }
            },
            { session }
        );

        post.isArchived = false;
        await post.save({ session });

        await session.commitTransaction();
        return post;

    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};
