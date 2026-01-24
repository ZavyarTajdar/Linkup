import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../Controllers/user.controller";
import { upload } from "../Middleware/multer.middleware";
import { verifyJWT } from "../Middleware/auth.middleware";

const router = Router();
router.post('/register', upload.fields([{ name: 'profileImg', maxCount: 1 }]), registerUser);
router.post('/login', loginUser);
router.post('/logout',verifyJWT, logoutUser);

export { router as userRoutes };