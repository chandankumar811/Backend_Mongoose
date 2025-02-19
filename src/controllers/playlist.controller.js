import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!(name && description)) {
    throw new ApiError(400, "name and description required");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: user._id,
  });

  if (!playlist) {
    throw new ApiError(404, "Error to create playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(404, "Invalid user Id");
  }

  const playlist = await Playlist.find({ owner: userId });

  if (!playlist) {
    throw new ApiError(404, "Error to fetched playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(401, "Invalid playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(401, "Error to fetched playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (isValidObjectId(playlistId)) {
    throw new ApiError(401, "Invalid playlist Id");
  }

  if (isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid video Id");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        video: videoId,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added successfully in the playlist")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(401, "Invalid playlistId or videoId");
  }

  const playlist = await findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        video: videoId,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Remove video successfully from playlist")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(401, "Invalid playlist id");
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

})
export { createPlaylist, getUserPlaylist };
