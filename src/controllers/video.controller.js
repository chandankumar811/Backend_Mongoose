import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler(async (req, res) => {});

const publisAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videoLocalPath = req.files?.video[0]?.path;

//   console.log(req.files?.video[0]?.path);

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(400, "Error to upload thumbnail on cloudinary");
  }

  const video = await uploadOnCloudinary(videoLocalPath);

  if (!video) {
    throw new ApiError(400, "Error to upload video on cloudinary");
  }


  const user = await User.findById(req.user?._id).select("-password -refreshToken")


  const publisedVideo = await Video.create({
    title,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    description,
    duration: video.duration,
    owner: user
  });

  const createVideo = await Video.findById(publisedVideo._id);

  if (!createVideo) {
    throw new ApiError(
      500,
      "Somethings went to wrong while registering the user"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createVideo, "Video created successfully"));
});

const getVideoById = asyncHandler(async(req, res) => {
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"))
})

export { publisAVideo, getVideoById };
