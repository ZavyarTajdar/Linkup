import { followUser, unfollowUser } from "../Controllers/following.controller";
import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware";
 
const router = Router();

router.post('/:followingId', verifyJWT, followUser )
router.post('/unfollow/:followingId', verifyJWT, unfollowUser )

export { router as followingRoutes }