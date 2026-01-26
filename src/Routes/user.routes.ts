import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateUserCredentials, updateProfileImage, getUserProfile, refreshAccessToken, deleteUserAccount } from "../Controllers/user.controller";
import { upload } from "../Middleware/multer.middleware";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();

router.post('/register', upload.fields([{ name: 'profileImg', maxCount: 1 }]), registerUser);
router.post('/login', loginUser);
router.post('/logout',verifyJWT, logoutUser);
router.put('/update-credentials', verifyJWT, updateUserCredentials);
router.patch('/update-profile-image', upload.fields([{ name: 'profileImage', maxCount: 1 }]), verifyJWT, updateProfileImage);
router.get('/profile', verifyJWT, getUserProfile);
router.post('/refresh-token', verifyJWT,refreshAccessToken);
router.delete('/delete-account', verifyJWT, deleteUserAccount);

export { router as userRoutes };