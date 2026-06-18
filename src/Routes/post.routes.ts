import { createPost, getAllPosts, updatePost } from "../Controllers/post.controller";
import { Router } from "express";
import { upload } from "../Middleware/multer.middleware";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post('/createPost', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'content', maxCount: 10 }]), verifyJWT, createPost);
router.put('/updatePost/:postId', upload.fields([{ name: 'thumbnail', maxCount: 1 }]), verifyJWT, updatePost);
router.get('/getAllPosts', getAllPosts);
export { router as postRoutes };