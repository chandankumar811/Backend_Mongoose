import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user.id;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(401, "Invalid channel Id");
  }

  if (userId === channelId) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "user is not found");
  }

  const existingSubscriber = await Subscription.findOne({
    channel: channelId,
    subscriber: user,
  });

  if (existingSubscriber) {
    await Subscription.findByIdAndDelete(existingSubscriber._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Channel unsubscribe successfully"));
  } else {
    const subscribe = await Subscription.create({
      channel: channelId,
      subscriber: user,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, subscribe, "Channel subscribe successfully"));
  }
});

const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // console.log(channelId)


  if (!isValidObjectId(channelId)) {
    throw new ApiError(401, "Invalid channel Id");
  }

  const subscriber = await Subscription.find({channel : channelId}).select(
    "-password -refreshToken"
  );

  if (!subscriber) {
    throw new ApiError(401, "Error to fetch subscriber");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscriber, "subscriber fetched successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(401, "Invalid channel Id");
  }

  const channels = await Subscription.find({ subscriber: channelId });

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Channels fetched successfully"));
});

export { toggleSubscription, getChannelSubscribers, getSubscribedChannels };
