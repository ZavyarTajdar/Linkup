import { createReel, deleteReel, getReelById, updateReel } from "../Controllers/reel.controller";
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

router.get(
    '/getReelById/:reelId',
    getReelById
);

router.put(
    '/updateReel/:reelId',
    verifyJWT,
    updateReel
);

router.delete(
    '/deleteReel/:reelId',
    verifyJWT,
    deleteReel
);


export { router as reelRoutes };
