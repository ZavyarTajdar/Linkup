import { Router } from "express";
import { deleteSavedCollectionByName, getSavedContentByUserIdController, getSavedCollectionByName, getSavedContent, saveContent, unsaveContent } from "../Controllers/saved.controller";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post("/save/post/:postId", verifyJWT, saveContent);
router.post("/save/reel/:reelId", verifyJWT, saveContent);

router.delete("/unsave/post/:postId", verifyJWT, unsaveContent);
router.delete("/unsave/reel/:reelId", verifyJWT, unsaveContent);

// Get saved content from a specific collection
router.get(
    "/saved",
    verifyJWT,
    getSavedContent
);

// Get a specific saved collection by name
router.get(
    "/saved/collection/:collectionName",
    verifyJWT,
    getSavedCollectionByName
);

// Get all saved collections of logged-in user
router.get(
    "/saved/user",
    verifyJWT,
    getSavedContentByUserIdController
);

// Delete saved collection by name
router.delete(
    "/saved/collection/:collectionName",
    verifyJWT,
    deleteSavedCollectionByName
);

export { router as savedRoutes };