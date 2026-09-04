import { savePostService } from "../Services/saved.service";
import { ApiResponse } from "../Utils/apiResponse";
import { asyncHandler } from "../Utils/asyncHandler";

export const savePost = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const { postId, reelId } = req.params;

    const saved = await savePostService(
        userId.toString(),
        postId as string,
        reelId as string
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                saved,
                "Content saved successfully"
            )
        );
});