import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateUserCredentials, updateProfileImage } from "../Controllers/user.controller";
import { upload } from "../Middleware/multer.middleware";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();
router.post('/register', upload.fields([{ name: 'profileImg', maxCount: 1 }]), registerUser);
router.post('/login', loginUser);
router.post('/logout',verifyJWT, logoutUser);
router.post('/update-credentials', verifyJWT, updateUserCredentials);
router.post('/update-profile-image', upload.fields([{ name: 'profileImage', maxCount: 1 }]), verifyJWT, updateProfileImage);


export { router as userRoutes };