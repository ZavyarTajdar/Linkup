import { Router } from "express";
import { savePost } from "../Controllers/saved.controller";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post("/save/post/:postId", verifyJWT, savePost);
router.post("/save/reel/:reelId", verifyJWT, savePost);

export { router as savedRoutes };