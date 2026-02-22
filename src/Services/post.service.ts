import { Post } from "../Models/post.model";
import { User } from "../Models/user.model";
import { ApiError } from "../Utils/apiError";
import { UploadOnCloudinary } from "../Utils/cloudinary";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const createPostService = async (data: {
    owner: string;
    title: string;
    description: string;
    thumbnail?: string;
    content: string[];
}) => {
    const { owner, title, description, thumbnail, content } = data;

    const uploadedThumbnail = thumbnail ? await UploadOnCloudinary(thumbnail) : null;

    const uploadContent = await Promise.all(content.map(content => UploadOnCloudinary(content)));

    if (uploadContent.some(upload => !upload?.url)) {
        throw new ApiError(400, "Failed to upload content");
    }

    const post = await Post.create({
        owner,
        title,
        description,
        thumbnail: uploadedThumbnail?.url || uploadContent[0]?.url,
        content: uploadContent.map(upload => upload?.url) as string[]
    });

    return post;
};

const updatePostService = async (data: {
    title: string;
    description: string;
    thumbnail?: string;
}) => {
    const { title, description, thumbnail } = data

    const uploadedThumbnail = thumbnail ? await UploadOnCloudinary(thumbnail) : null;

    const post = await Post.findByIdAndUpdate(
        {
            title,
            description,
            thumbnail: uploadedThumbnail?.url
        },
        {
            new: true
        }
    );
    return post;
}

const getAllPostsService = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [posts, countPost] = await Promise.all([
        Post.find()
            .populate("owner", "username nickname")
            .populate("likes", "likedby")
            .populate("comments", "content commentedby")
            .lean(),
        Post.countDocuments()
    ]);

    return {
        posts,
        countPost,
        totalPages: Math.ceil(countPost / limit),
        currentPage: page
    };
}

export { createPostService, updatePostService, getAllPostsService };