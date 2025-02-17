import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  console.log(videoId);

  const likedBy = await User.findById(req.user?._id);
  if (!likedBy) {
    throw new ApiError(400, "user doesn't exist");
  }

  // console.log(likedBy);

  const existingLike = await Like.findOne({ video: videoId, likedBy: likedBy });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(new ApiResponse(200, "video unlike sucessful"));
  } else {
    const like = await Like.create({
      video: videoId,
      likedBy: likedBy,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, like, "video liked successfully"));
  }
});

const getLikedVideo = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user?._id)
 
    if(!user){
        throw new ApiError(404, "user not found")
    }
   
    const likedVideos = await Like.find({likedBy: user.id}).populate("video")

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "liked video fetched sucessfully"))
})

export { toggleVideoLike, getLikedVideo };
