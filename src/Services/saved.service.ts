import { ISaved } from "../Interfaces/saved.interface";
import { Post } from "../Models/post.model";
import { Reel } from "../Models/reel.model";
import { ApiError } from "../Utils/apiError";
import { Saved } from "../Models/saved.model";
import { Types } from "mongoose";
import { User } from "../Models/user.model";

export const saveContentService = async (
    collectionName: string,
    userId: string,
    postId?: string,
    reelId?: string
): Promise<ISaved> => {

    if (!postId && !reelId) {
        throw new ApiError(400, "Post or reel ID is required");
    }

    // Find user's collection
    let savedCollection = await Saved.findOne({
        userId,
        collectionName
    });

    // Create collection if it doesn't exist
    if (!savedCollection) {
        savedCollection = await Saved.create({
            userId,
            collectionName,
            postId: postId ? [new Types.ObjectId(postId)] : [],
            reelId: reelId ? [new Types.ObjectId(reelId)] : [],
        });
    }

    // Save Post
    if (postId) {
        const post = await Post.findById(postId);

        if (!post) {
            throw new ApiError(404, "Post not found");
        }

        if (savedCollection.postId.includes(post._id)) {
            throw new ApiError(400, "Post already saved");
        }

        savedCollection.postId.push(post._id);
    }

    // Save Reel
    if (reelId) {
        const reel = await Reel.findById(reelId);

        if (!reel) {
            throw new ApiError(404, "Reel not found");
        }

        if (savedCollection.reelId.includes(new Types.ObjectId(reel._id))) {
            throw new ApiError(400, "Reel already saved");
        }

        savedCollection.reelId.push(new Types.ObjectId(reel._id));
    }

    await savedCollection.save();

    return savedCollection;
};

export const unsaveContentService = async (
    userId: string,
    collectionName: string,
    postId?: string,
    reelId?: string
): Promise<void> => {

    if (!postId && !reelId) {
        throw new ApiError(400, "Post or reel ID is required");
    }

    if (!collectionName) {
        throw new ApiError(400, "Collection name is required");
    }

    const saved = await Saved.findOne({
        userId: new Types.ObjectId(userId),
        collectionName,
        ...(postId && {
            postId: new Types.ObjectId(postId)
        }),
        ...(reelId && {
            reelId: new Types.ObjectId(reelId)
        })
    });

    if (!saved) {
        throw new ApiError(404, "Saved content not found");
    }

    if (postId) {
        saved.postId = saved.postId.filter(
            id => id.toString() !== postId
        );
    }

    if (reelId) {
        saved.reelId = saved.reelId.filter(
            id => id.toString() !== reelId
        );
    }

    await saved.save();
};
