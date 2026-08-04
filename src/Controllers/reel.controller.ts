import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { 
    createReelService,
    getAllCreatorReelsService,
    getAllFollowingReelsService,
} from "../Services/reel.service"

export const createReel = asyncHandler(async (req, res) => {
    const owner = req.user!._id;
    const { caption } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const contentPath = files?.content?.[0]?.path;

    if (!contentPath) {
        throw new ApiError(400, "Reel content is required");
    }

    const coverPath = files?.cover?.[0]?.path;
    const reel = await createReelService({
        owner,
        video: contentPath,
        cover: coverPath,
        caption,
    });

    res.status(201).json(new ApiResponse(201, reel, "Reel created successfully"));
})

export const getAllCreatorReels = asyncHandler(async (req, res) => {
    const reels = await getAllCreatorReelsService();
    res.status(200).json(new ApiResponse(200, reels, "Reels fetched successfully"));
});

export const getAllFollowingReels = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const reels = await getAllFollowingReelsService(userId);
    res.status(200).json(new ApiResponse(200, reels, "Reels fetched successfully"));
});

export const getReelById = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    // TODO: Get single reel by ID
});

export const updateReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    // TODO: Update reel caption and/or thumbnail
});

export const deleteReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    // TODO: Delete reel
});

export const toggleLikeReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    // TODO: Like or unlike reel
});

export const toggleSaveReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    // TODO: Save or unsave reel
});

export const addViewToReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    // TODO: Increase reel view count
});

export const getUserReels = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // TODO: Get all reels of a specific user
});

export const getFollowingReels = asyncHandler(async (req, res) => {
    // TODO: Get reels from users that the logged-in user follows
});

export const getSavedReels = asyncHandler(async (req, res) => {
    // TODO: Get all saved reels of logged-in user
});

export const getLikedReels = asyncHandler(async (req, res) => {
    // TODO: Get all liked reels of logged-in user
});

export const getTrendingReels = asyncHandler(async (req, res) => {
    // TODO: Get trending reels based on views and engagement
});