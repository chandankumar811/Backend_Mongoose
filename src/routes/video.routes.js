import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoById, publisAVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.use(verifyJWT);

router.route("/").post(
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1,
        },
        {
            name: "video",
            maxCount: 1
        }
    ]),
    publisAVideo
)

router.route("/:videoId").get(getVideoById)

export default router