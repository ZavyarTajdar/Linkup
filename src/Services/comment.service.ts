import { User } from "../Models/user.model"
import { ApiError } from "../Utils/apiError";

export const commentCreateService = async(contentId: string, contentType: string, message: string, author: string) => {
    const commentator = await User.findById(author).select("username nickname profileImg");
    
    const contentTypeEnums = ["reel", "post", "story"]

    if (!contentTypeEnums.includes(contentType)) {
        throw new ApiError(400, "Invalid content type");
    }
    
    if (contentType === "reel") {
        
    }else if (contentType === "post") {
        
    }else if (contentType === "story") {
        
    }
}