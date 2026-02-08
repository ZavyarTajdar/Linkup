import { Router } from "express"
import { userRoutes } from "./user.routes";
import { postRoutes } from "./post.routes";
const routes = Router()

// User Routes

routes.use("/user", userRoutes);

// Post Routes

routes.use("/post", postRoutes);

export default routes;