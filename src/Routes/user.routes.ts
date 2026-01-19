import { Router } from "express";
import { registerUser, loginUser } from "../Controllers/user.controller";

const router = Router();
router.post('/register', registerUser);
router.post('/login', loginUser);


export { router as userRoutes };