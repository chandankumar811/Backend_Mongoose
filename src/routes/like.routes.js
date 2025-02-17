import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedVideo, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/videos").get(getLikedVideo)

export default router;
