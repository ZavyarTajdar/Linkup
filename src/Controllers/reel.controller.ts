import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { 
    createReelService,
    getAllCreatorReelsService,
    getAllFollowingReelsService,
    getReelByIdService,
    updateReelService,
    deleteReelService,
    toggleLikeReelService,
    getUserReelsService,
    getFollowingReelsService,
    getTrendingReelsService,
} from "../Services/reel.service"

export const createReel = asyncHandler(async (req, res) => {
    const owner = req.user!._id;
    const { caption } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const videoPath = files?.video?.[0]?.path;

    if (!videoPath) {
        throw new ApiError(400, "Reel content is required");
    }

    const coverPath = files?.cover?.[0]?.path;
    const reel = await createReelService({
        owner,
        video: videoPath,
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
    const userId = req.user?._id
    const reel = await getReelByIdService(userId as string , reelId as string);
    res.status(200).json(new ApiResponse(200, reel, "Reel fetched successfully"));
});

export const updateReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    const { caption, cover } = req.body;
    const reel = await updateReelService(reelId as string, { caption, cover });
    res.status(200).json(new ApiResponse(200, reel, "Reel updated successfully"));
});

export const deleteReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    const reel = await deleteReelService(reelId as string);
    res.status(200).json(new ApiResponse(200, reel, "Reel deleted successfully"));
});

export const toggleLikeReel = asyncHandler(async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user?._id;

    const { reel, isLiked } = await toggleLikeReelService(reelId as string, userId);
    res.status(200).json(new ApiResponse(200, { reel, isLiked }, "Reel liked/unliked successfully"));
});

// export const toggleSaveReel = asyncHandler(async (req, res) => {
//     const { reelId } = req.params;
//     // TODO: Save or unsave reel
// }); saved contrller mei ayega

export const getUserReels = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const reels = await getUserReelsService(userId as string);

    return res.status(200).json(
        new ApiResponse(
            200,
            reels,
            "User reels fetched successfully",
        )
    );
});

export const getFollowingReels = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const reels = await getFollowingReelsService(userId);

    res.status(200).json(new ApiResponse(200, reels, "Following reels fetched successfully"));
});

// export const getSavedReels = asyncHandler(async (req, res) => {
//     // TODO: Get all saved reels of logged-in user
// });

// export const getLikedReels = asyncHandler(async (req, res) => {
//     // TODO: Get all liked reels of logged-in user
// });

export const getTrendingReels = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const reels = await getTrendingReelsService(userId);

    res.status(200).json(new ApiResponse(200, reels, "Trending reels fetched successfully"));
});