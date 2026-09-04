import { Router } from "express"
import { userRoutes } from "./user.routes";
import { postRoutes } from "./post.routes";
import { followingRoutes } from "./following.routes";
import { reelRoutes } from "./reel.routes";
import { likeRoutes } from "./like.routes";
import { savedRoutes } from "./saved.routes";
const routes = Router()

// User Routes

routes.use("/user", userRoutes);

// Post Routes

routes.use("/post", postRoutes);

// Following Routes

routes.use("/following", followingRoutes )

// Reel Routes

routes.use("/reel", reelRoutes);

// Like Routes

routes.use("/like", likeRoutes);

// Saved Routes

routes.use("/saved", savedRoutes);

export default routes;