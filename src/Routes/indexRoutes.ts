import { Router } from "express"
import { userRoutes } from "./user.routes";
import { postRoutes } from "./post.routes";
import { followingRoutes } from "./following.routes";
const routes = Router()

// User Routes

routes.use("/user", userRoutes);

// Post Routes

routes.use("/post", postRoutes);


routes.use("/following", followingRoutes )
export default routes;