import { 
    createPost, 
    getAllPosts, 
    updatePost, 
    fetchPostById, 
    fetchPostsByUserId, 
    getOwnPosts, 
    deletePost,
    archivePost,
    unarchivePost
 } from "../Controllers/post.controller";
import { Router } from "express";
import { upload } from "../Middleware/multer.middleware";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post('/createPost', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'content', maxCount: 10 }]), verifyJWT, createPost);
router.put('/updatePost/:postId', upload.fields([{ name: 'thumbnail', maxCount: 1 }]), verifyJWT, updatePost);
router.get('/getAllPosts',verifyJWT, getAllPosts);
router.get('/fetchPostById/:postId', verifyJWT, fetchPostById);
router.get('/fetchPostsByUserId/:userId',verifyJWT, fetchPostsByUserId);
router.get('/getOwnPosts', verifyJWT, getOwnPosts);
router.delete('/deletePost/:postId', verifyJWT, deletePost);
router.post('/archivePost/:postId', verifyJWT, archivePost);
router.post('/unarchivePost/:postId', verifyJWT, unarchivePost);

export { router as postRoutes };