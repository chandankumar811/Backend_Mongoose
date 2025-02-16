import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publisAVideo, updateVideoDetails, updateVideoThumbnail } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.use(verifyJWT);

router.route("/")
.get(getAllVideos)
.post(
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
router.route("/:videoId/delete").get(deleteVideo)
router.route("/:videoId/details").patch(updateVideoDetails)
router.route("/:videoId/thumbnail").patch(upload.single("thumbnail"), updateVideoThumbnail)

export default router