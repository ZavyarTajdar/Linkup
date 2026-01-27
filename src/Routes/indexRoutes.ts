import { Router } from "express"
import { userRoutes } from "./user.routes";

const routes = Router()

// User Routes

routes.use("/user", userRoutes);

// Post Routes



export default routes;