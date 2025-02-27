import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;

  console.log(channelId);

  if (!channelId) {
    throw new ApiError(401, "Error to get channel id");
  }

  const noOfSubscriber = await Subscription.countDocuments({
    channel: channelId,
  });

  if (!noOfSubscriber) {
    throw new ApiError(401, "Error to fetch number of subscriber");
  }

  const totalNoOfVideos = await Video.countDocuments({ owner: channelId });
  // console.log("number of video", totalNoOfVideos);

  const video = await Video.find({owner: channelId});
  if (!video) {
    throw new ApiError(401, "Error to fetch video view");
  }
  console.log(video)

  let totalViews = video.reduce((sum, video) => sum + (video.view || 0), 0);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { noOfSubscriber, totalNoOfVideos, totalViews },
        "fetch successfull"
      )
    );
});

const getAllChannelVideo = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;

  if (!channelId) {
    throw new ApiError(401, "Error to get channel id");
  }

  const totalVideo = await Video.find({ owner: channelId });

  if (!totalVideo) {
    throw new ApiError(401, "Error to fetch video");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, totalVideo, "Channel videos fetched successfull")
    );
});

export { getChannelStats, getAllChannelVideo};
