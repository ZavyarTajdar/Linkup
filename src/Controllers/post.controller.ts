import { asyncHandler } from "../Utils/asyncHandler";
import { ApiResponse } from "../Utils/apiResponse";
import { ApiError } from "../Utils/apiError";
import { createPostService } from "../Services/post.service";


const createPost = asyncHandler(async (req, res) => {
    const { title, description, thumbnail } = req.body;
    const owner = req.user._id;

    const content = req.files?.content ? (req.files.content as Express.Multer.File[]).map(file => file.path) : [];
    if (!title || !description || !content) {
        throw new ApiError(400, "Title, description, and content are required");
    }

    const thumbnailPath = req.files?.thumbnail ? (req.files.thumbnail as Express.Multer.File[])[0].path : undefined;
    const post = await createPostService({ owner, title, description, thumbnail: thumbnailPath, content });

    res.status(201).json(new ApiResponse(201, "Post created successfully", post));
});

export { createPost };