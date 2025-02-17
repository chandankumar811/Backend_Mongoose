import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addAComment } from "../controllers/comment.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/:videoId").post(addAComment)

export default router