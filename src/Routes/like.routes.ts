import { toggleLikePost, toggleLikeReel } from "../Controllers/like.controller";
import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post('/post/:postId', verifyJWT, toggleLikePost);
router.post('/reel/:reelId', verifyJWT, toggleLikeReel);

export { router as likeRoutes };
