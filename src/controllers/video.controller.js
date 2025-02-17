import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { application } from "express";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  let filter = {};

  if (query) {
    filter.title = { $regex: query, $option: "i" };
  }

  if (userId) {
    filter.userId = userId;
  }

  const sortOptions = {};

  const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const totalVideos = await Video.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalPages: Math.ceil(totalVideos / limitNumber),
        currentPage: pageNumber,
        videos,
      },
      "Videos fetch successfully"
    )
  );
});

const publisAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  console.log(req.body);

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videoLocalPath = req.files?.video[0]?.path;

  console.log(req.files?.video[0]?.path);

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

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  const publisedVideo = await Video.create({
    title,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    description,
    duration: video.duration,
    owner: user,
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

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "Atleast one filed is required");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details update sucessfull"));
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail image file is missing");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail.url) {
    throw new ApiError(400, "Error while uploading thumnail on cloudinary");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video thumbnail update sucessfull"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video is not found");
  }

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "video deleted sucessfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  console.log(videoId)

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  // console.log(video)

  if (!video) {
    throw new ApiError(404, "Video is not found");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video ${video.isPublished ? "published" : "unpublished"} sucessfully`
      )
    );
});

export {
  publisAVideo,
  getVideoById,
  updateVideoDetails,
  updateVideoThumbnail,
  deleteVideo,
  getAllVideos,
  togglePublishStatus,
};
