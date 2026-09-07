import { saveContentService, unsaveContentService, getSavedContentService, getSavedCollectionByNameService, getSavedContentByUserIdService } from "../Services/saved.service";
import { ApiResponse } from "../Utils/apiResponse";
import { asyncHandler } from "../Utils/asyncHandler";

export const saveContent = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { collectionName } = req.body
    const { postId, reelId } = req.params;

    const saved = await saveContentService(
        collectionName,
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

export const unsaveContent = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { collectionName } = req.body;
    const { postId, reelId } = req.params;
    
    await unsaveContentService(
        userId.toString(),
        collectionName as string,
        postId as string,
        reelId as string
    );

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Content unsaved successfully"));
});

export const getSavedContent = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { collectionName } = req.body;
    const { postId, reelId } = req.params;

    const saved = await getSavedContentService(
        userId.toString(),
        collectionName as string
    );

    return res
        .status(200)
        .json(new ApiResponse(200, saved, "Saved content fetched successfully"));
});

export const getSavedCollectionByName = asyncHandler(
    async (req, res) => {

        const { collectionName } = req.params;
        const userId = req.user?._id;

        const saved = await getSavedCollectionByNameService(
            userId.toString(),
            collectionName as string
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                saved,
                "Saved content fetched successfully"
            )
        );
    }
);

export const getSavedContentByUserIdController = asyncHandler(
    async (req, res) => {

        const userId = req.user?._id;

        const saved = await getSavedContentByUserIdService(
            userId.toString()
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                saved,
                "Saved content fetched successfully"
            )
        );
    }
);