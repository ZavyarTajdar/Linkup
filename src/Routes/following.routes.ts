import { followUser, unfollowUser, cancelFollowRequest, removeFollower, rejectFollowRequest, acceptFollowRequest, getFollowerRequests } from "../Controllers/following.controller";
import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware";
 
const router = Router();

router.post('/:followingId', verifyJWT, followUser )
router.post('/unfollow/:followingId', verifyJWT, unfollowUser )
router.post('/cancel-request/:followingId', verifyJWT, cancelFollowRequest )
router.post('/reject-request/:followingId', verifyJWT, rejectFollowRequest )
router.post('/accept-request/:followingId', verifyJWT, acceptFollowRequest )
router.post('/remove-follower/:followerId', verifyJWT, removeFollower )
router.get('/requests', verifyJWT, getFollowerRequests )
export { router as followingRoutes }