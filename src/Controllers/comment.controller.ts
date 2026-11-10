import { asyncHandler } from "../Utils/asyncHandler";
import Comment  from "../Models/comment.model"


export const commentCreate = asyncHandler(async(req, res) => {
    const { contentId, contentType, message } = req.body;
    const { author } = req.user?._id

    
})