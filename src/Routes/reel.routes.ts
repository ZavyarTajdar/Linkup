import { createReel } from "../Controllers/reel.controller";
import { Router } from "express";
import { upload } from "../Middleware/multer.middleware";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post(
    '/createReel',
    upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
    verifyJWT,
    createReel
);

export { router as reelRoutes };
