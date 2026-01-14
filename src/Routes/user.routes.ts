import { Router } from "express";
import { registerUser } from "../Controllers/user.controller";

const router = Router();
router.post('/register', registerUser);

export { router as userRoutes };