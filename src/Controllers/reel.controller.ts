import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { 
    createReelService,
} from "../Services/reel.service"

export const createReel = asyncHandler(async (req, res) => {
    const creator = req.user!._id;
    const { caption } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const contentPath = files?.content?.[0]?.path;

    if (!contentPath) {
        throw new ApiError(400, "Reel content is required");
    }

    const thumbnailPath = files?.thumbnail?.[0]?.path;
    const reel = await createReelService({
        creator,
        content: contentPath,
        thumbnail: thumbnailPath,
        caption,
    });

    res.status(201).json(new ApiResponse(201, reel, "Reel created successfully"));
})