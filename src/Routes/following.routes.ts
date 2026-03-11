import { followUser } from "../Controllers/following.controller";
import { Router } from "express";
import { verifyJWT } from "../Middleware/auth.middleware";
 
const router = Router();

router.post('/:followingId', verifyJWT, followUser )

export { router as followingRoutes }