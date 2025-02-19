import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);

router.route("/user/:userId").get(getUserPlaylist);

export default router;
