import { Router } from "express";
import { saveContent, unsaveContent } from "../Controllers/saved.controller";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post("/save/post/:postId", verifyJWT, saveContent);
router.post("/save/reel/:reelId", verifyJWT, saveContent);

router.delete("/unsave/post/:postId", verifyJWT, unsaveContent);
router.delete("/unsave/reel/:reelId", verifyJWT, unsaveContent);

export { router as savedRoutes };