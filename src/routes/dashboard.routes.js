import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllChannelVideo, getChannelStats } from "../controllers/dashboard.controller.js";


const router = Router()
router.use(verifyJWT)

router.route("/stats").get(getChannelStats)
router.route("/video").get(getAllChannelVideo)

export default router