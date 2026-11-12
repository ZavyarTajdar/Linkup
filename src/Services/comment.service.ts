import { Post } from "../Models/post.model";
import { Reel } from "../Models/reel.model";
import { Story } from "../Models/story.model";
import { User } from "../Models/user.model"
import { ApiError } from "../Utils/apiError";


export const commentCreateService = async (
    contentId: string,
    message: string,
    author: string
) => {
    const commentator = await User.findById(author)
        .select("username nickname profileImg");

    if (!commentator) {
        throw new ApiError(404, "User not found");
    }

    let content = await Reel.findById(contentId);
    let contentType = "reel";

    if (!content) {
        content = await Post.findById(contentId);
        contentType = "post";
        
    }

    if (!content) {
        content = await Story.findById(contentId);
        contentType = "story";
    }

    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    switch (contentType) {
        case "reel":
            // Reel comment creation to be completed 
            break;

        case "post":
            // Post comment creation to be completed 
            break;

        case "story":
            // Story comment creation to be completed 
            break;
    }
};
