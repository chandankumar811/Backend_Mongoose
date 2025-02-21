import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { deleteTweet, publishATweet, updateTweet } from "../controllers/tweet.controller";

const router = Router();
router.use(verifyJWT)

router.route("/").post(publishATweet);
router.route("/user/:userId").get();
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);